/**
 * @description A model for representing tokens.
 *
 * @module
 */
import { model, Schema } from "mongoose";
import validator from "validator";

export interface IToken {
  token_id: string;
  userIDInApp: number;
  username: string;
  email: string;
  user_reg_date: string;
}

const tokenSchema = new Schema<IToken>(
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

export const Token = model<IToken>("Token", tokenSchema);
export type ITokenDocument = ReturnType<(typeof Token)["hydrate"]>;
