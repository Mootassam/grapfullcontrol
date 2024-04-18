import mongoose from "mongoose";
import FileSchema from "./schemas/fileSchema";
import TenantUserSchema from "./schemas/tenantUserSchema";
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model("user");
  } catch (error) {
    // continue, because model doesnt exist
  }

  const UserSchema = new Schema(
    {
      fullName: { type: String, maxlength: 255 },

      phoneNumber: { type: String, maxlength: 24, default: "+915824135435" },

      passportPhoto: [FileSchema],
      passportDocument: [FileSchema],

      country: {
        type: String,
        default: "India",
      },

      erc20: {
        type: String,
        default: "jsdfhnsdjknf524sdfkhsdnkl",
      },
      trc20: {
        type: String,
        default: "564sdfgisdjfpoisdjfo2312",
      },

      balance: {
        type: Number,
        default: 85,
      },

      invitationcode: {
        type: String,
        default: "TF1102",
      },

      vip: {
        type: Schema.Types.ObjectId,
        ref: "vip",
      },
      
      product: {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
      
      email: {
        type: String,
        maxlength: 255,
        index: { unique: true },
      },
      password: {
        type: String,
        maxlength: 255,
        select: false,
      },
      emailVerified: { type: Boolean, default: false },
      emailVerificationToken: {
        type: String,
        maxlength: 255,
        select: false,
      },
      emailVerificationTokenExpiresAt: { type: Date },
      passwordResetToken: {
        type: String,
        maxlength: 255,
        select: false,
      },
      passwordResetTokenExpiresAt: { type: Date },
      avatars: [FileSchema],
      tenants: [TenantUserSchema],
      jwtTokenInvalidBefore: { type: Date },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      importHash: { type: String, maxlength: 255 },
    },
    {
      timestamps: true,
    }
  );

  UserSchema.index(
    { importHash: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: "string" },
      },
    }
  );

  UserSchema.virtual("id").get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  UserSchema.set("toJSON", {
    getters: true,
  });

  UserSchema.set("toObject", {
    getters: true,
  });

  return database.model("user", UserSchema);
};
