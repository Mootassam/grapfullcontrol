import MongooseRepository from "./mongooseRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import AuditLogRepository from "./auditLogRepository";
import Error404 from "../../errors/Error404";
import { IRepositoryOptions } from "./IRepositoryOptions";
import FileRepository from "./fileRepository";
import Records from "../models/records";
import Error405 from "../../errors/Error405";
import Dates from "../utils/Dates";
import Product from "../models/product";
import UserRepository from "./userRepository";
import product from "../models/product";

class RecordRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    const currentUser = MongooseRepository.getCurrentUser(options);

    await this.checkOrder(options);

    await this.calculeGrap(data, options);

    const [record] = await Records(options.database).create(
      [
        {
          ...data,
          tenant: currentTenant.id,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
          date: Dates.getDate(),
          datecreation: Dates.getTimeZoneDate(),
        },
      ],
      options
    );

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options
    );

    return this.findById(record.id, options);
  }

  static async calculeGrap(data, options) {
    // Find the current product based on the provided data
    const currentProduct = await Product(options.database).findOne({
      _id: data.product,
    });

    const currentUser = MongooseRepository.getCurrentUser(options);
    const currentUserBalance = currentUser.balance;
    const productBalance = currentProduct.amount;
    const currentCommission = currentProduct.commission; // Corrected typo in 'commission'

    let total;

    if (currentUser && currentUser.product && currentUser.product.id) {
      // Subtract total amount including commission from current user's balance
      total =
        parseFloat(currentUserBalance) -
        this.calculeTotal(productBalance, currentCommission);
    } else {
      // Add total amount including commission to current user's balance
      total =
        parseFloat(currentUserBalance) +
        this.calculeTotal(productBalance, currentCommission);
    }

    const updatedValues = {
      balance: total,
    };

    // Update user's profile with the new balance and product
    await UserRepository.updateProfileGrap(
      currentUser.id, // Use currentUser.id instead of currentUserid
      updatedValues,
      options
    );
  }

  // Removed the static keyword to define a regular function
  static calculeTotal(price, commission) {
    const total =
      parseFloat(price) + (parseFloat(price) * parseFloat(commission)) / 100;
    return total;
  }

  static async CountOrder(options) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    const currentDate = this.getTimeZoneDate(); // Get current date

    const record = await Records(options.database)
      .find({
        user: currentUser.id,
        // Compare dates in the same format
        datecreation: { $in: Dates.getTimeZoneDate() }, // Convert current date to Date object
      })
      .countDocuments();

    const data = {
      record: record,
    };

    return data;
  }

  static async checkOrder(options) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    const currentDate = this.getTimeZoneDate(); // Get current date

    const record = await Records(options.database)
      .find({
        user: currentUser.id,
        // Compare dates in the same format
        datecreation: { $in: Dates.getTimeZoneDate() }, // Convert current date to Date object
      })
      .countDocuments();

    const dailyOrder = currentUser.vip.dailyorder;

    if (currentUser && currentUser.vip && currentUser.vip.id) {
      if (record >= dailyOrder) {
        throw new Error405(
          "This is your limit. Please come back tomorrow to perform more tasks."
        );
      }

      if (currentUser.balance < 0) {
        throw new Error405("Your balance is not enough. Please recharge.");
      }
    } else {
      throw new Error405("Please subscribe to at least one VIP package.");
    }
  }

  static getTimeZoneDate() {
    const dubaiTimezone = "Asia/Dubai";
    const options = {
      timeZone: dubaiTimezone,
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };
    const currentDateTime = new Date().toLocaleDateString("en-US", options);

    return currentDateTime;
  }

  static async update(id, data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Records(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Records(options.database).updateOne(
      { _id: id },
      {
        ...data,
        updatedBy: MongooseRepository.getCurrentUser(options).id,
      },
      options
    );

    await this._createAuditLog(AuditLogRepository.UPDATE, id, data, options);

    record = await this.findById(id, options);

    return record;
  }

  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Records(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Records(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(AuditLogRepository.DELETE, id, record, options);
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    return MongooseRepository.wrapWithSessionIfExists(
      Records(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Records(options.database)
        .findById(id)
        .populate("user")
        .populate("product"),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    return this._fillFileDownloadUrls(record);
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);
    let criteriaAnd: any = [];

    criteriaAnd.push({
      tenant: currentTenant.id,
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.user) {
        criteriaAnd.push({
          user: filter.user,
        });
      }
      if (filter.product) {
        criteriaAnd.push({
          product: filter.product,
        });
      }

      if (filter.number) {
        criteriaAnd.push({
          number: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.number),
            $options: "i",
          },
        });
      }

      if (filter.status) {
        criteriaAnd.push({
          status: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.status),
            $options: "i",
          },
        });
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let rows = await Records(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("user")
      .populate("product");

    const count = await Records(options.database).countDocuments(criteria);

    rows = await Promise.all(rows.map(this._fillFileDownloadUrls));

    return { rows, count };
  }

  static async findAndCountAllMobile(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);
    let criteriaAnd: any = [];

    criteriaAnd.push({
      tenant: currentTenant.id,
      user: currentUser.id,
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.user) {
        criteriaAnd.push({
          user: filter.user,
        });
      }
      if (filter.product) {
        criteriaAnd.push({
          product: filter.product,
        });
      }

      if (filter.number) {
        criteriaAnd.push({
          number: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.number),
            $options: "i",
          },
        });
      }

      if (filter.status) {
        criteriaAnd.push({
          status: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.status),
            $options: "i",
          },
        });
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let listitems = await Records(options.database)
      .find(criteria)
      .skip(skip)
      .sort(sort)
      .populate("user")
      .populate("product");

    let rows = await Records(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort)
      .populate("user")
      .populate("product");

    const count = await Records(options.database).countDocuments(criteria);

    rows = await Promise.all(rows.map(this._fillFileDownloadUrls));

    let total = 0;

    listitems.map((item) => {
      let data = item.product;
      let itemTotal =
        parseFloat(data.amount) +
        (parseFloat(data.commission) * parseFloat(data.amount)) / 100;

      total += itemTotal;
    });
    total = parseFloat(total.toFixed(3));

    return { rows, count, total };
  }

  static async findAllAutocomplete(search, limit, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: Array<any> = [
      {
        tenant: currentTenant.id,
      },
    ];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            titre: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort("titre_ASC");
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Records(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.titre,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: Records(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options
    );
  }

  static async _fillFileDownloadUrls(record) {
    if (!record) {
      return null;
    }
    const output = record.toObject ? record.toObject() : record;
    output.product.photo = await FileRepository.fillDownloadUrl(
      output.product.photo
    );

    return output;
  }
}

export default RecordRepository;
