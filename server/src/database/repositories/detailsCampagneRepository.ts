import MongooseRepository from "./mongooseRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import AuditLogRepository from "./auditLogRepository";
import Error404 from "../../errors/Error404";
import { IRepositoryOptions } from "./IRepositoryOptions";
import DetailsCampagne from "../models/detailsCampagne";
import FileRepository from "./fileRepository";
import Campagne from "../models/campagne";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

class DetailsCampagneRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    const currentUser = MongooseRepository.getCurrentUser(options);

    const [record] = await DetailsCampagne(options.database).create(
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

    await MongooseRepository.refreshTwoWayRelationOneToMany(
      record,
      "campagne",
      Campagne(options.database),
      "details",
      options
    );

    return this.findById(record.id, options);
  }

  static async update(id, data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      DetailsCampagne(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await DetailsCampagne(options.database).updateOne(
      { _id: id },
      {
        ...data,
        updatedBy: MongooseRepository.getCurrentUser(options).id,
      },
      options
    );

    await this._createAuditLog(AuditLogRepository.UPDATE, id, data, options);

    record = await this.findById(id, options);

    await MongooseRepository.refreshTwoWayRelationOneToMany(
      record,
      "campagne",
      Campagne(options.database),
      "details",
      options
    );

    return record;
  }

  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      DetailsCampagne(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await DetailsCampagne(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(AuditLogRepository.DELETE, id, record, options);

    await MongooseRepository.destroyRelationToMany(
      id,
      Campagne(options.database),
      "details",
      options
    );
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    return MongooseRepository.wrapWithSessionIfExists(
      DetailsCampagne(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    let record = await MongooseRepository.wrapWithSessionIfExists(
      DetailsCampagne(options.database)
        .findById(id)
        .populate("adherent")
        .populate("palier"),
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

    let criteriaAnd: any = [];
    let idcampagne = new mongoose.Types.ObjectId(filter.campagne);

    criteriaAnd.push({
      tenant: currentTenant.id,
      campagne: idcampagne,
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.adherent) {
        criteriaAnd.push({
          adherent: MongooseQueryUtils.uuid(filter.adherent),
        });
      }

      if (filter.palier) {
        criteriaAnd.push({
          palier: MongooseQueryUtils.uuid(filter.palier),
        });
      }

      if (filter.statutPay) {
        criteriaAnd.push({
          statutPay: filter.statutPay,
        });
      }
      if (filter.campagne) {
        criteriaAnd.push({
          campagne: idcampagne,
        });
      }

      if (filter.montantRange) {
        const [start, end] = filter.montantRange;

        if (start !== undefined && start !== null && start !== "") {
          criteriaAnd.push({
            montant: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== "") {
          criteriaAnd.push({
            montant: {
              $lte: end,
            },
          });
        }
      }

      if (filter.typePay) {
        criteriaAnd.push({
          typePay: filter.typePay,
        });
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

    let rows = await DetailsCampagne(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("adherent")
      .populate("palier");

    const count = await DetailsCampagne(options.database).countDocuments(
      criteria
    );

    rows = await Promise.all(rows.map(this._fillFileDownloadUrls));

    return { rows, count };
  }

  static async findAdherentAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: any = [];

    let iduser = new mongoose.Types.ObjectId(filter.iduser);

    criteriaAnd.push({
      tenant: currentTenant.id,
    });

    criteriaAnd.push({
      adherent: iduser,
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.palier) {
        criteriaAnd.push({
          palier: MongooseQueryUtils.uuid(filter.palier),
        });
      }

      if (filter.statutPay) {
        criteriaAnd.push({
          statutPay: filter.statutPay,
        });
      }

      if (filter.titre) {
        criteriaAnd.push({
          titre: filter.titre,
        });
      }
      if (filter.montantRange) {
        const [start, end] = filter.montantRange;

        if (start !== undefined && start !== null && start !== "") {
          criteriaAnd.push({
            montant: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== "") {
          criteriaAnd.push({
            montant: {
              $lte: end,
            },
          });
        }
      }

      if (filter.typePay) {
        criteriaAnd.push({
          typePay: filter.typePay,
        });
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

    let rows = await DetailsCampagne(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("adherent")
      .populate("palier");

    const count = await DetailsCampagne(options.database).countDocuments();

    rows = await Promise.all(rows.map(this._fillFileDownloadUrls));

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

    const records = await DetailsCampagne(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: DetailsCampagne(options.database).modelName,
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

    output.facture = await FileRepository.fillDownloadUrl(output.facture);

    return output;
  }
  // !api for mobile   //
  // !list adhesions for the currentUser //

  static async findDetailsCompagne(options: IRepositoryOptions) {
    const currentUSer = MongooseRepository.getCurrentUser(options);
    const record = await DetailsCampagne(options.database)
      .find(
        {
          adherent: currentUSer.id,
        },
        {
          typePay: 1,
          montant: 1,
          palier: 1,
          titre: 1,
          facture: 1,
          statutPay: 1,
        }
      )
      .populate("palier");

    const count = await DetailsCampagne(options.database)
      .find({
        adherent: currentUSer.id,
      })
      .find(
        {
          adherent: currentUSer.id,
        },
        {
          typePay: 1,
          montant: 1,
          palier: 1,
          titre: 1,
          facture: 1,
          statutPay: 1,
        }
      )
      .populate("palier")
      .countDocuments();
    return { record, count };
  }
}

export default DetailsCampagneRepository;
