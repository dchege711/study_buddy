/**
 * @description Test relations and properties of the database and its models.
 */

import { UniqueConstraintError, ValidationError } from "sequelize";
import { isUUID } from "validator";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

import { sequelize, User } from "./DBModels";
import {
  VALID_EMAIL_ADDRESSES,
  INVALID_EMAIL_ADDRESSES,
} from "./DBModels.Test.Data";

// Added to ease testing promises.
chai.use(chaiAsPromised);
chai.should();
const assert = chai.assert;

describe("DB.Models", function () {
  // Clean the database before each test in this suite.
  beforeEach(async function () {
    return sequelize.sync({ force: true, logging: false });
  });

  interface IUserCreationDetails {
    userName: string;
    emailAddress: string;
    hasValidatedAccount: boolean;
  }

  const dummyUserDetails: IUserCreationDetails = {
    userName: "user",
    emailAddress: "user@example.com",
    hasValidatedAccount: false,
  };

  describe("User", function () {
    it("should reject incomplete initialization of users", function () {
      return User.create({ userName: "test-user" }).should.be.rejectedWith(
        ValidationError,
        "cannot be null"
      );
    });

    it("should generate a UUID as a primary key", function () {
      return User.create(dummyUserDetails).then(function (user: User) {
        const primaryKeys: string[] = User.primaryKeyAttributes;
        assert(primaryKeys.length == 1, "There should be one primary key");
        assert(primaryKeys[0] === "id", "The PK should be 'id'");
        assert(isUUID(user.id, "4"), "User ID should be a UUIDv4");
      });
    });

    it("should generate a timestamp for creation date", function () {
      return User.create(dummyUserDetails).then(function(user: User) {
        assert.isOk(user.createdAt, "There should be a createdAt timestamp");
        const currentTime = Date.now();
        const creationTime = user.createdAt.getTime();
        assert.isBelow(creationTime, currentTime);
        assert.isAbove(creationTime, currentTime - 5000); // 5,000ms = 5 sec ago
      });
    });

    describe("UserNames", function () {
      // Should also take care of duplicate user names as they're a subset.
      it("should treat the username as case-insensitive", function () {
        let user1: IUserCreationDetails = {
          emailAddress: "user-1@example.com",
          userName: "user",
          hasValidatedAccount: false,
        };
        let user2: IUserCreationDetails = {
          emailAddress: "user-2@example.com",
          userName: "UsEr",
          hasValidatedAccount: false,
        };

        assert(user1.userName !== user2.userName);
        assert(
          user1.userName.toLowerCase() === user2.userName.toLocaleLowerCase()
        );

        return Promise.all([
          User.create(user1).should.be.fulfilled,
          User.create(user2)
            .catch(function (err: ValidationError) {
              err.message += `; ${err.errors[0].message}`;
              throw err;
            })
            .should.be.rejectedWith(ValidationError, "userName must be unique"),
        ]);
        
      });

      let emailDistinguisher = 0;
      function testUser(userName: string): IUserCreationDetails {
        emailDistinguisher += 1;
        return {
          emailAddress: `user-${emailDistinguisher}@example.com`,
          userName: userName,
          hasValidatedAccount: false,
        };
      }

      it("should reject invalid usernames", function () {
        return Promise.all(
          ["!beginning", "end?", "😌 🏀", "*"].map(function (userName) {
            return User.create(testUser(userName)).should.be.rejectedWith(
              ValidationError,
              "username"
            );
          })
        );
      });
    });

    describe("Email Addresses", function () {
      // Should also take care of duplicate email addresses as they're a subset.
      it("should treat the email address as case-insensitive", function () {
        let user1: IUserCreationDetails = {
          emailAddress: "a@example.com",
          userName: "user",
          hasValidatedAccount: false,
        };
        let user2: IUserCreationDetails = {
          emailAddress: "A@eXaMpLe.Com",
          userName: "user2",
          hasValidatedAccount: false,
        };

        assert(user1.emailAddress !== user2.emailAddress);
        assert(
          user1.emailAddress.toLowerCase() ===
            user2.emailAddress.toLocaleLowerCase()
        );
        return User.create(user1).then(function (_: User) {
          return User.create(user2).should.be.rejectedWith(
            UniqueConstraintError
          );
        });
      });

      let userNameDistinguisher = 0;
      function testUser(emailAddress: string): IUserCreationDetails {
        userNameDistinguisher += 1;
        return {
          emailAddress: emailAddress,
          userName: `user${userNameDistinguisher}`,
          hasValidatedAccount: false,
        };
      }

      it("should reject invalid email addresses", function () {
        return Promise.all(
          INVALID_EMAIL_ADDRESSES.map(function (emailAddress) {
            return User.create(testUser(emailAddress))
              .then(function (u: User) {
                return Promise.reject(
                  new ValidationError(
                    `${u.emailAddress} should not be a valid email address`
                  )
                );
              })
              .should.be.rejectedWith(ValidationError, "email address");
          })
        );
      });

      it("should accept valid email addresses", function () {
        return Promise.all(
          VALID_EMAIL_ADDRESSES.map(function (emailAddress) {
            return User.create(testUser(emailAddress)).catch(function (
              err: ValidationError
            ) {
              err.message += `; received >>>${err.errors[0].value}<<<`;
              throw err;
            }).should.be.fulfilled;
          })
        );
      });
    });

    it("should link to one password hash and salt", function () {
      throw new Error("Not implemented yet.");
    });

    it("should link to one preferences document", function () {
      throw new Error("Not implemented yet.");
    });

    it("should have a valid one-to-one relationship w/ `UserAuthenticationData`", function () {
      throw new Error("Not implemented yet.");
    });

    it("should have a valid 1:1 relationship w/ `UserPreferences`", function () {
      throw new Error("Not implemented yet.");
    });

    it("should have a valid 1:1 relationship w/ `ReviewStreak`", function () {
      throw new Error("Not implemented yet.");
    });
  });

  describe("UserAuthenticationData", function () {
    it("should reject incomplete initialization", function () {
      throw new Error("not implemented yet.");
    });

    it("should have a valid 1:1 association with `User`", function () {
      throw new Error("Not implemented yet.");
    });
  });

  describe("UserPrefences", function () {
    it("should reject incomplete initialization", function () {
      throw new Error("not implemented yet.");
    });

    it("should have card privacy set to true by default", function () {
      throw new Error("Not implemented yet.");
    });

    it("should have the daily target set to some positive number", function () {
      throw new Error("Not implemented yet.");
    });

    it("should have a valid 1:1 association with `User`", function () {
      throw new Error("Not implemented yet.");
    });
  });

  describe("UserAuthenticationToken", function () {
    it("should reject incomplete initialization", function () {
      throw new Error("not implemented yet.");
    });

    it("should set a default unique token value", function () {
      throw new Error("Not implemented yet.");
    });

    it("should include timestamps on the token", function () {
      throw new Error("Not implemented yet.");
    });
  });

  describe("FlashCard", function () {
    it("should reject incomplete initialization", function () {
      throw new Error("Not implemented yet.");
    });

    it("should overwrite htmlDescription before saving a card", function () {
      throw new Error("Not implemented yet.");
    });

    it("should limit urgencies to between 0 and 10, inclusive", function () {
      throw new Error("Not implemented yet.");
    });

    it("should respect UserPreferences when `isPublic` is not set", function () {
      throw new Error("Not implemented yet.");
    });

    it("should reject invalid deletion timestamps", function () {
      throw new Error("Not implemented yet.");
    });

    it("should automatically add creation and update timestamps", function () {
      throw new Error("Not implemented yet.");
    });

    it("should support multiple children associations", function () {
      throw new Error("Not implemented yet.");
    });

    it("should support at most one parent association", function () {
      throw new Error("Not implemented yet.");
    });

    it("should support many/no `Tag` associations", function () {
      throw new Error("Not implemented yet.");
    });
  });

  describe("Tag", function () {
    it("should reject incomplete initialization", function () {
      throw new Error("Not implemented yet.");
    });

    it("value should be unique but case-sensitive", function () {
      throw new Error("Not implemented yet.");
    });

    it("should support m:n association with `FlashCard`", function () {
      throw new Error("Not implemented yet.");
    });
  });

  describe("ReviewStreak", function () {
    it("should reject incomplete initialization", function () {
      throw new Error("Not implemented yet.");
    });

    it("should have a 1:1 association with `User`", function () {
      throw new Error("Not implemented yet.");
    });

    it("should only allow non-negative streak-lengths", function () {
      throw new Error("Not implemented yet.");
    });
  });
});
