import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import Projet from '../models/projet';
import FileRepository from './fileRepository';

import Votes from '../models/votes';
import Dons from '../models/dons';
import VotesRepository from './votesRepository';
import DonsRepository from './donsRepository';

class ProjetRepository {

  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await Projet(
      options.database,
    ).create(
      [
        {
          ...data,
          tenant: currentTenant.id,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        }
      ],
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options,
    );

    await MongooseRepository.refreshTwoWayRelationManyToOne(
      record,
      Projet(options.database),
      'votes',
      Votes(options.database),
      'projet',
      options,
    );

    await MongooseRepository.refreshTwoWayRelationManyToOne(
      record,
      Projet(options.database),
      'dons',
      Dons(options.database),
      'projet',
      options,
    );

    return this.findById(record.id, options);
  }

  static async update(id, data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Projet(options.database).findById(id),
      options,
    );

    if (
      !record ||
      String(record.tenant) !== String(currentTenant.id)
    ) {
      throw new Error404();
    }

    await Projet(options.database).updateOne(
      { _id: id },
      {
        ...data,
        updatedBy: MongooseRepository.getCurrentUser(
          options,
        ).id,
      },
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      id,
      data,
      options,
    );

    record = await this.findById(id, options);

    await MongooseRepository.refreshTwoWayRelationManyToOne(
      record,
      Projet(options.database),
      'votes',
      Votes(options.database),
      'projet',
      options,
    );

    await MongooseRepository.refreshTwoWayRelationManyToOne(
      record,
      Projet(options.database),
      'dons',
      Dons(options.database),
      'projet',
      options,
    );

    return record;
  }

  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Projet(options.database).findById(id),
      options,
    );
    if (record.votes) {
      record.votes.forEach(vote => {
        VotesRepository.destroy(vote._id, options)
      });
    }
    if (record.dons) {
      record.dons.forEach(don => {
        DonsRepository.destroy(don._id, options)
      });
    }

    if (
      !record ||
      String(record.tenant) !== String(currentTenant.id)
    ) {
      throw new Error404();
    }

    await Projet(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );


  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    return MongooseRepository.wrapWithSessionIfExists(
      Projet(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options,
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Projet(options.database)
        .findById(id)
        .populate('votes')
        .populate('dons'),
      options,
    );

    if (
      !record ||
      String(record.tenant) !== String(currentTenant.id)
    ) {
      throw new Error404();
    }

    return this._fillFileDownloadUrls(record);
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    let criteriaAnd: any = [];

    criteriaAnd.push({
      tenant: currentTenant.id,
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ['_id']: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.titre) {
        criteriaAnd.push({
          titre: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.titre,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.description) {
        criteriaAnd.push({
          description: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.description,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.details) {
        criteriaAnd.push({
          details: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.details,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.typeProjet) {
        criteriaAnd.push({
          typeProjet: filter.typeProjet
        });
      }

      if (filter.statutProjet) {
        criteriaAnd.push({
          statutProjet: filter.statutProjet
        });
      }

      if (filter.budgetRange) {
        const [start, end] = filter.budgetRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            budget: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            budget: {
              $lte: end,
            },
          });
        }
      }

      if (filter.lieu) {
        criteriaAnd.push({
          lieu: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.lieu,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.dateDebutProjetRange) {
        const [start, end] = filter.dateDebutProjetRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            dateDebutProjet: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            dateDebutProjet: {
              $lte: end,
            },
          });
        }
      }

      if (filter.dateFinProjetRange) {
        const [start, end] = filter.dateFinProjetRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            dateFinProjet: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            dateFinProjet: {
              $lte: end,
            },
          });
        }
      }

      if (filter.dateDebutDonRange) {
        const [start, end] = filter.dateDebutDonRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            dateDebutDon: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            dateDebutDon: {
              $lte: end,
            },
          });
        }
      }

      if (filter.dateFinDonRange) {
        const [start, end] = filter.dateFinDonRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            dateFinDon: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            dateFinDon: {
              $lte: end,
            },
          });
        }
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          criteriaAnd.push({
            ['createdAt']: {
              $gte: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          criteriaAnd.push({
            ['createdAt']: {
              $lte: end,
            },
          });
        }
      }
    }

    const sort = MongooseQueryUtils.sort(
      orderBy || 'createdAt_DESC',
    );

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length
      ? { $and: criteriaAnd }
      : null;

    let rows = await Projet(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('votes')
      .populate('dons');

    const count = await Projet(
      options.database,
    ).countDocuments(criteria);

    rows = await Promise.all(
      rows.map(this._fillFileDownloadUrls),
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
          {
            titre: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: 'i',
            }
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('titre_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Projet(options.database)
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
        entityName: Projet(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options,
    );
  }

  static async _fillFileDownloadUrls(record) {
    if (!record) {
      return null;
    }

    const output = record.toObject
      ? record.toObject()
      : record;

    output.photoPrincipal = await FileRepository.fillDownloadUrl(
      output.photoPrincipal,
    );

    output.photos = await FileRepository.fillDownloadUrl(
      output.photos,
    );

    output.attachements = await FileRepository.fillDownloadUrl(
      output.attachements,
    );

    return output;
  }
}

export default ProjetRepository;
