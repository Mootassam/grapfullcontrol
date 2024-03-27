import mongoose from "mongoose";
import FileSchema from "./schemas/fileSchema";
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model("transaction");
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CategorySchema = new Schema(
    {
      status: {
        type: String,
        enum: ["enable", "disable"],
        default: "enable",
      },
      amount: {
        type: String,
      },
      type: {
        type: String,
        enum: ["withdraw", "deposit"],
        default: "withdraw",
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },

      tenant: {
        type: Schema.Types.ObjectId,
        ref: "tenant",
        required: true,
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

  CategorySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: "string" },
      },
    }
  );

  CategorySchema.virtual("id").get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  CategorySchema.set("toJSON", {
    getters: true,
  });

  CategorySchema.set("toObject", {
    getters: true,
  });

  return database.model("transaction", CategorySchema);
};
