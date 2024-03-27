import Error400 from "../errors/Error400";
import MongooseRepository from "../database/repositories/mongooseRepository";
import { IServiceOptions } from "./IServiceOptions";
import ProduitCommandeRepository from "../database/repositories/produitCommandeRepository";
import CommandLineRepository from "../database/repositories/commandLineRepository";
import UserRepository from "../database/repositories/userRepository";
import ProduitRepository from "../database/repositories/produitRepository";
import CommandLine from "../database/models/commandLine";

export default class ProduitCommandeService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database
    );

    try {
      data.adherent = await UserRepository.filterIdInTenant(data.adherent, {
        ...this.options,
        session,
      });
      data.commandLine = await CommandLineRepository.filterIdsInTenant(
        data.commandLine,
        { ...this.options, session }
      );

      data.commandLine.map((line) => {
        CommandLineRepository.findById(line, this.options).then((res) => {
          if (res.product.stockable) {
            let productData = {
              stock: res.product.stock - res.quantity,
            };
            ProduitRepository.update(res.product.id, productData, this.options);
          }
        });
      });
      const record = await ProduitCommandeRepository.create(data, {
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
        "produitCommande"
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database
    );
    try {
      data.adherent = await UserRepository.filterIdInTenant(data.adherent, {
        ...this.options,
        session,
      });
      data.commandLine = await CommandLineRepository.filterIdsInTenant(
        data.commandLine,
        { ...this.options, session }
      );
      let productCommand = await this.findById(id);
      let oldCommandLines = productCommand.commandLine;
      for (let i = 0; i < oldCommandLines.length; i++) {
        await CommandLineRepository.findById(
          oldCommandLines[i],
          this.options
        ).then((res) => {
          if (res.product.stockable) {
            let productData = {
              stock: res.product.stock + res.quantity,
            };
            ProduitRepository.update(res.product.id, productData, this.options);
          }
        });
      }

      for (let i = 0; i < data.commandLine.length; i++) {
        await CommandLineRepository.findById(
          data.commandLine[i],
          this.options
        ).then((res) => {
          if (res.product.stockable) {
            let productData = {
              stock: res.product.stock - res.quantity,
            };
            ProduitRepository.update(res.product.id, productData, this.options);
          }
        });
      }

      const record = await ProduitCommandeRepository.update(id, data, {
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
        "produitCommande"
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
        const data = await this.findById(id);
        data.commandLine = await CommandLineRepository.filterIdsInTenant(
          data.commandLine,
          { ...this.options, session }
        );
        data.commandLine.map((line) => {
          CommandLineRepository.findById(line, this.options).then((res) => {
            if (res.product.stockable) {
              let productData = {
                stock: res.product.stock + res.quantity,
              };
              ProduitRepository.update(
                res.product.id,
                productData,
                this.options
              );
            }
          });
        });
        await ProduitCommandeRepository.destroy(id, {
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
    return ProduitCommandeRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return ProduitCommandeRepository.findAllAutocomplete(
      search,
      limit,
      this.options
    );
  }

  async findAndCountAll(args) {
    return ProduitCommandeRepository.findAndCountAll(args, this.options);
  }

  async findProduitsCommandesAndCountAll(args) {
    return ProduitCommandeRepository.findProduitsCommandesAndCountAll(
      args,
      this.options
    );
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
    const count = await ProduitCommandeRepository.count(
      {
        importHash,
      },
      this.options
    );

    return count > 0;
  }

  // !api for mobile   //
  // !list Achats for the currentUser //

  async findAchats() {
    return ProduitCommandeRepository.findAchats(this.options);
  }
}
