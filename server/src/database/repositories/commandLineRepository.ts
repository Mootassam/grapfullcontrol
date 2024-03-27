import MongooseRepository from "./mongooseRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import AuditLogRepository from "./auditLogRepository";
import Error404 from "../../errors/Error404";
import { IRepositoryOptions } from "./IRepositoryOptions";
import lodash from "lodash";
import CommandLine from "../models/commandLine";
import ProduitCommande from "../models/produitCommande";
import ProduitRepository from "./produitRepository";

class CommandLineRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    const currentUser = MongooseRepository.getCurrentUser(options);

    const [record] = await CommandLine(options.database).create(
      [
        {
          ...data,
          tenant: currentTenant.id,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        },
      ],
      options
    );

    // const commandLine = await this.findById(record.id, options)
    // if (commandLine.product.stockable) {
    //   let productData = {
    //     stock: commandLine.product.stock - commandLine.quantity
    //   }
    //   await ProduitRepository.update(commandLine.product.id, productData, options)
    // }

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options
    );

    return this.findById(record.id, options);
  }

  static async update(id, data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      CommandLine(options.database).findOne({
        _id: id,
        tenant: currentTenant.id,
      }),
      options
    );

    if (!record) {
      throw new Error404();
    }

    await CommandLine(options.database).updateOne(
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
      CommandLine(options.database).findOne({
        _id: id,
        tenant: currentTenant.id,
      }),
      options
    );

    if (!record) {
      throw new Error404();
    }

    await CommandLine(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(AuditLogRepository.DELETE, id, record, options);

    await MongooseRepository.destroyRelationToMany(
      id,
      ProduitCommande(options.database),
      "commandLine",
      options
    );
  }

  static async filterIdInTenant(id, options: IRepositoryOptions) {
    return lodash.get(await this.filterIdsInTenant([id], options), "[0]", null);
  }

  static async filterIdsInTenant(ids, options: IRepositoryOptions) {
    if (!ids || !ids.length) {
      return [];
    }

    const currentTenant = MongooseRepository.getCurrentTenant(options);

    const records = await CommandLine(options.database)
      .find({
        _id: { $in: ids },
        tenant: currentTenant.id,
      })
      .select(["_id"]);

    return records.map((record) => record._id);
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    return MongooseRepository.wrapWithSessionIfExists(
      CommandLine(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      CommandLine(options.database)
        .findOne({ _id: id, tenant: currentTenant.id })
        .populate("product"),
      options
    );

    if (!record) {
      throw new Error404();
    }

    return this._mapRelationshipsAndFillDownloadUrl(record);
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

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

      if (filter.product) {
        criteriaAnd.push({
          product: MongooseQueryUtils.uuid(filter.product),
        });
      }

      if (filter.quantityRange) {
        const [start, end] = filter.quantityRange;

        if (start !== undefined && start !== null && start !== "") {
          criteriaAnd.push({
            quantity: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== "") {
          criteriaAnd.push({
            quantity: {
              $lte: end,
            },
          });
        }
      }

      if (filter.productTitre) {
        criteriaAnd.push({
          productTitle: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.productTitle),
            $options: "i",
          },
        });
      }

      if (filter.subTotalRange) {
        const [start, end] = filter.subTotalRange;

        if (start !== undefined && start !== null && start !== "") {
          criteriaAnd.push({
            subTotal: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== "") {
          criteriaAnd.push({
            subTotal: {
              $lte: end,
            },
          });
        }
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== "") {
          criteriaAnd.push({
            ["createdAt"]: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== "") {
          criteriaAnd.push({
            ["createdAt"]: {
              $lte: end,
            },
          });
        }
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let rows = await CommandLine(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("product");

    const count = await CommandLine(options.database).countDocuments(criteria);

    rows = await Promise.all(
      rows.map(this._mapRelationshipsAndFillDownloadUrl)
    );

    return { rows, count };
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
        ],
      });
    }

    const sort = MongooseQueryUtils.sort("id_ASC");
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await CommandLine(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort)
      .populate("product");

    return records.map((record) => ({
      id: record.id,
      label: record.id,
      product: record.product,
      quantity: record.quantity,
      subTotal: record.subTotal,
      productTitle: record.productTitle,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: CommandLine(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options
    );
  }

  static async _mapRelationshipsAndFillDownloadUrl(record) {
    if (!record) {
      return null;
    }
    const output = record.toObject ? record.toObject() : record;
    return output;
  }
}

export default CommandLineRepository;
