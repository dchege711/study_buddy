"use strict";

/**
 * A collection of utilities that don't fit neatly in any given file.
 *
 * @module
 */

import { PUBLIC_USER_EMAIL, PUBLIC_USER_USERNAME } from "../config";
import { getRandomString, registerUserAndPassword } from "./LogInUtilities";
import { updatePublicUserMetadata } from "./MetadataMongoDB";
import { Card } from "./mongoose_models/CardSchema";
import { IUser, User } from "./mongoose_models/UserSchema";

/**
 * @description Add a dummy user in order to make managing the browse page for
 * public cards easier
 */
export async function addPublicUser(): Promise<IUser> {
  const existingUser = await User.findOne({
    username: PUBLIC_USER_USERNAME,
    email: PUBLIC_USER_EMAIL,
  }).exec();
  if (existingUser) {
    return existingUser;
  }

  await registerUserAndPassword({
    username: PUBLIC_USER_USERNAME,
    email: PUBLIC_USER_EMAIL as string,
    password: getRandomString(20), // Never meant to login
  });

  const user = await User
    .findOne({ username: PUBLIC_USER_USERNAME, email: PUBLIC_USER_EMAIL })
    .exec();
  if (!user) {
    return Promise.reject("Could not find the user we just created");
  }

  const publicCards = await Card.find({ isPublic: true }).exec();
  await updatePublicUserMetadata(
    publicCards.map((card) => ({ card, previousTags: "" })),
  );

  return user;
}
