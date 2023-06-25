/**
 * @description A model for representing tokens.
 *
 * @module
 */
import { model, Schema, Document } from "mongoose";
import validator from "validator";

interface ITokenRaw {
    token_id: string;
    userIDInApp: number;
    username: string;
    email: string;
    user_reg_date: string;
}

var tokenSchema = new Schema<ITokenRaw>(
    {
        token_id: {
            type: String,
            required: true,
            unique: [true, "This token already exists"],
        },
        userIDInApp: Number,
        username: String,
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, 'Please provide a valid email address']
        },
        user_reg_date: String
    },
    {
        autoIndex: false,
        collection: "study_buddy_tokens",
        strict: true
    }
);

export const Token = model<ITokenRaw>('Token', tokenSchema);
export type IToken = ITokenRaw & Document<any, any, ITokenRaw>;
