import MongooseRepository from "./mongooseRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import AuditLogRepository from "./auditLogRepository";
import Error404 from "../../errors/Error404";
import { IRepositoryOptions } from "./IRepositoryOptions";
import lodash from "lodash";
import Produit from "../models/produit";
import FileRepository from "./fileRepository";
import CommandLine from "../models/commandLine";
import ProduitCategorie from "../models/produitCategorie";

class ProduitRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    const currentUser = MongooseRepository.getCurrentUser(options);

    const [record] = await Produit(options.database).create(
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

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options
    );

    await MongooseRepository.refreshTwoWayRelationManyToMany(
      record,
      // Produit(options.database),
      "category",
      ProduitCategorie(options.database),
      "produit",
      options
    );

    return this.findById(record.id, options);
  }

  static async update(id, data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Produit(options.database).findOne({ _id: id, tenant: currentTenant.id }),
      options
    );

    if (!record) {
      throw new Error404();
    }

    await Produit(options.database).updateOne(
      { _id: id },
      {
        ...data,
        updatedBy: MongooseRepository.getCurrentUser(options).id,
      },
      options
    );

    await this._createAuditLog(AuditLogRepository.UPDATE, id, data, options);

    record = await this.findById(id, options);

    await MongooseRepository.refreshTwoWayRelationManyToMany(
      record,
      // Produit(options.database),
      "category",
      ProduitCategorie(options.database),
      "produit",
      options
    );

    return record;
  }

  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Produit(options.database).findOne({ _id: id, tenant: currentTenant.id }),
      options
    );

    if (!record) {
      throw new Error404();
    }

    await Produit(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(AuditLogRepository.DELETE, id, record, options);

    await MongooseRepository.destroyRelationToOne(
      id,
      CommandLine(options.database),
      "product",
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

    const records = await Produit(options.database)
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
      Produit(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Produit(options.database)
        .findOne({ _id: id, tenant: currentTenant.id })
        .populate("category"),
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

      if (filter.titre) {
        criteriaAnd.push({
          titre: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.titre),
            $options: "i",
          },
        });
      }

      if (filter.category) {
        criteriaAnd.push({
          category: MongooseQueryUtils.uuid(filter.category),
        });
      }

      if (filter.description) {
        criteriaAnd.push({
          description: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.description),
            $options: "i",
          },
        });
      }

      if (
        filter.stockable === true ||
        filter.stockable === "true" ||
        filter.stockable === false ||
        filter.stockable === "false"
      ) {
        criteriaAnd.push({
          stockable: filter.stockable === true || filter.stockable === "true",
        });
      }

      if (
        filter.publish === true ||
        filter.publish === "true" ||
        filter.publish === false ||
        filter.publish === "false"
      ) {
        criteriaAnd.push({
          publish: filter.publish === true || filter.publish === "true",
        });
      }

      if (filter.prixRange) {
        const [start, end] = filter.prixRange;

        if (start !== undefined && start !== null && start !== "") {
          criteriaAnd.push({
            prix: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== "") {
          criteriaAnd.push({
            prix: {
              $lte: end,
            },
          });
        }
      }

      if (filter.stockRange) {
        const [start, end] = filter.stockRange;

        if (start !== undefined && start !== null && start !== "") {
          criteriaAnd.push({
            stock: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== "") {
          criteriaAnd.push({
            stock: {
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

    let rows = await Produit(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort);

    const count = await Produit(options.database).countDocuments(criteria);

    rows = await Promise.all(
      rows.map(this._mapRelationshipsAndFillDownloadUrl)
    );

    return { rows, count };
  }

  static async findAllAutocomplete(search, limit, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    let criteriaAnd: Array<any> = [{
      tenant: currentTenant.id,
    }];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('id_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Produit(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: Produit(options.database).modelName,
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

    output.photos = await FileRepository.fillDownloadUrl(output.photos);

    return output;
  }
}

export default ProduitRepository;
