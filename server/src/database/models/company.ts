import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model("company");
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CompanySchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      companydetails: {
        type: String,
        required: true,
      },
      tc: {
        type: String,
        required: true,
      },
      faqs: {
        type: String,
        required: true,
      },

      tenant: {
        type: Schema.Types.ObjectId,
        ref: "tenant",
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      importHash: { type: String },
    },
    { timestamps: true }
  );

  CompanySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: "string" },
      },
    }
  );

  CompanySchema.virtual("id").get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  CompanySchema.set("toJSON", {
    getters: true,
  });

  CompanySchema.set("toObject", {
    getters: true,
  });

  return database.model("company", CompanySchema);
};
