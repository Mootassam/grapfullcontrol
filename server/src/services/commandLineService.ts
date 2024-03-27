import Error400 from "../errors/Error400";
import MongooseRepository from "../database/repositories/mongooseRepository";
import { IServiceOptions } from "./IServiceOptions";
import CommandLineRepository from "../database/repositories/commandLineRepository";
import ProduitRepository from "../database/repositories/produitRepository";

export default class CommandLineService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database
    );

    try {
      data.product = await ProduitRepository.filterIdInTenant(data.product, {
        ...this.options,
        session,
      });

      const record = await CommandLineRepository.create(data, {
        ...this.options,
        session,
      });

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        "commandLine"
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database
    );

    try {
      data.product = await ProduitRepository.filterIdInTenant(data.product, {
        ...this.options,
        session,
      });
      const commandLine = await this.findById(id);
      if (commandLine.product.stockable) {
        if (data.quantity > commandLine.quantity) {
          let productData = {
            stock:
              commandLine.product.stock -
              (data.quantity - commandLine.quantity),
          };
          await ProduitRepository.update(
            commandLine.product.id,
            productData,
            this.options
          );
        } else if (data.quantity < commandLine.quantity) {
          let productData = {
            stock:
              commandLine.product.stock +
              (commandLine.quantity - data.quantity),
          };
          await ProduitRepository.update(
            commandLine.product.id,
            productData,
            this.options
          );
        }
      }
      const record = await CommandLineRepository.update(id, data, {
        ...this.options,
        session,
      });

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        "commandLine"
      );

      throw error;
    }
  }

  async destroyAll(ids) {
    const session = await MongooseRepository.createSession(
      this.options.database
    );

    try {
      for (const id of ids) {
        await CommandLineRepository.destroy(id, {
          ...this.options,
          session,
        });
      }

      await MongooseRepository.commitTransaction(session);
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async findById(id) {
    return CommandLineRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return CommandLineRepository.findAllAutocomplete(
      search,
      limit,
      this.options
    );
  }

  async findAndCountAll(args) {
    return CommandLineRepository.findAndCountAll(args, this.options);
  }

  async import(data, importHash) {
    if (!importHash) {
      throw new Error400(
        this.options.language,
        "importer.errors.importHashRequired"
      );
    }

    if (await this._isImportHashExistent(importHash)) {
      throw new Error400(
        this.options.language,
        "importer.errors.importHashExistent"
      );
    }

    const dataToCreate = {
      ...data,
      importHash,
    };

    return this.create(dataToCreate);
  }

  async _isImportHashExistent(importHash) {
    const count = await CommandLineRepository.count(
      {
        importHash,
      },
      this.options
    );

    return count > 0;
  }
}
