/**
 * @description A model for representing tokens.
 *
 * @module
 */
import { Document, model, Schema } from "mongoose";
import validator from "validator";

interface ITokenRaw {
  token_id: string;
  userIDInApp: number;
  username: string;
  email: string;
  user_reg_date: string;
}

const tokenSchema = new Schema<ITokenRaw>(
  {
    token_id: {
      type: String,
      required: true,
      unique: true,
    },
    userIDInApp: { type: Number, immutable: true },
    username: { type: String, immutable: true },
    email: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    user_reg_date: { type: String, immutable: true },
  },
  {
    autoIndex: false,
    collection: "study_buddy_tokens",
    strict: true,
  },
);

export const Token = model<ITokenRaw>("Token", tokenSchema);
export type IToken = ITokenRaw & Document<any, any, ITokenRaw>;
