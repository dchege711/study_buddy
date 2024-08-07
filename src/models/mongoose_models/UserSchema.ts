/**
 * @description A model for representing users in the database.
 *
 * @module
 */

import { model, Schema } from "mongoose";
import validator from "validator";

export interface IUser {
  username: string;
  salt: Array<number>;
  hash: Array<number>;
  userIDInApp: number;
  email: string;
  reset_password_uri: string;
  reset_password_timestamp: number;
  account_validation_uri: string;
  account_is_valid: boolean;
  cardsAreByDefaultPrivate: boolean;
  dailyTarget: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      match: /[_\-A-Za-z0-9]+/,
    },
    salt: Array,
    hash: Array,
    userIDInApp: {
      type: Number,
      unique: true,
      immutable: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    reset_password_uri: String,
    reset_password_timestamp: Number,
    account_validation_uri: String,
    account_is_valid: Boolean,
    cardsAreByDefaultPrivate: { type: Boolean, default: true },
    dailyTarget: { type: Number, default: 20 },
  },
  {
    timestamps: true,
    autoIndex: false,
    collection: "study_buddy_users",
    strict: true,
  },
);

export const User = model<IUser>("User", userSchema);
export type IUserDocument = ReturnType<(typeof User)["hydrate"]>;
