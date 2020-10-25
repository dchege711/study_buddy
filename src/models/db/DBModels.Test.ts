/**
 * @description Test relations and properties of the database and its models.
 */

import {
  UniqueConstraintError,
  ValidationError,
  ForeignKeyConstraintError,
} from "sequelize";
import { isUUID } from "validator";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

import {
  sequelize,
  IUserCreationValues,
  User,
  IReviewStreakCreationValues,
  ReviewStreak,
  USER_CREATE_OPTIONS,
  IUserAuthenticationData,
} from "./DBModels";
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

  const dummyReviewStreakDetails: IReviewStreakCreationValues = {};
  const dummyUserAuthData: IUserAuthenticationData = {
    passwordHash: [0, 1, 2, 3, 4],
    passwordSalt: [5, 6, 7, 8, 9],
  };

  const dummyUserDetails: IUserCreationValues = {
    userName: "user",
    emailAddress: "user@example.com",
    ReviewStreak: dummyReviewStreakDetails,
    UserAuthenticationDatum: dummyUserAuthData,
  };

  describe("User", function () {
    it("should generate a UUID as a primary key", function () {
      return User.create(dummyUserDetails, USER_CREATE_OPTIONS).then(function (
        user: User
      ) {
        const primaryKeys: string[] = User.primaryKeyAttributes;
        assert(primaryKeys.length == 1, "There should be one primary key");
        assert(primaryKeys[0] === "id", "The PK should be 'id'");
        assert(isUUID(user.id, "4"), "User ID should be a UUIDv4");
      });
    });

    it("should generate a timestamp for creation date", function () {
      return User.create(dummyUserDetails, USER_CREATE_OPTIONS).then(function (
        user: User
      ) {
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
        let user1: IUserCreationValues = {
          emailAddress: "user-1@example.com",
          userName: "user",
          ReviewStreak: dummyReviewStreakDetails,
          UserAuthenticationDatum: dummyUserAuthData,
        };
        let user2: IUserCreationValues = {
          emailAddress: "user-2@example.com",
          userName: "UsEr",
          ReviewStreak: dummyReviewStreakDetails,
          UserAuthenticationDatum: dummyUserAuthData,
        };

        assert(user1.userName !== user2.userName);
        assert(
          user1.userName.toLowerCase() === user2.userName.toLocaleLowerCase()
        );

        return Promise.all([
          User.create(user1, USER_CREATE_OPTIONS).should.be.fulfilled,
          User.create(user2, USER_CREATE_OPTIONS)
            .catch(function (err: ValidationError) {
              err.message += `; ${err.errors[0].message}`;
              throw err;
            })
            .should.be.rejectedWith(ValidationError, "userName must be unique"),
        ]);
      });

      let emailDistinguisher = 0;
      function testUser(userName: string): IUserCreationValues {
        emailDistinguisher += 1;
        return {
          emailAddress: `user-${emailDistinguisher}@example.com`,
          userName: userName,
          ReviewStreak: dummyReviewStreakDetails,
          UserAuthenticationDatum: dummyUserAuthData,
        };
      }

      it("should reject invalid usernames", function () {
        return Promise.all(
          ["!beginning", "end?", "😌 🏀", "*"].map(function (userName) {
            return User.create(
              testUser(userName),
              USER_CREATE_OPTIONS
            ).should.be.rejectedWith(ValidationError, "username");
          })
        );
      });
    });

    describe("Email Addresses", function () {
      // Should also take care of duplicate email addresses as they're a subset.
      it("should treat the email address as case-insensitive", function () {
        let user1: IUserCreationValues = {
          emailAddress: "a@example.com",
          userName: "user",
          ReviewStreak: dummyReviewStreakDetails,
          UserAuthenticationDatum: dummyUserAuthData,
        };
        let user2: IUserCreationValues = {
          emailAddress: "A@eXaMpLe.Com",
          userName: "user2",
          ReviewStreak: dummyReviewStreakDetails,
          UserAuthenticationDatum: dummyUserAuthData,
        };

        assert(user1.emailAddress !== user2.emailAddress);
        assert(
          user1.emailAddress.toLowerCase() ===
            user2.emailAddress.toLocaleLowerCase()
        );
        return User.create(user1, USER_CREATE_OPTIONS).then(function (_: User) {
          return User.create(user2, USER_CREATE_OPTIONS).should.be.rejectedWith(
            UniqueConstraintError
          );
        });
      });

      let userNameDistinguisher = 0;
      function testUser(emailAddress: string): IUserCreationValues {
        userNameDistinguisher += 1;
        return {
          emailAddress: emailAddress,
          userName: `user${userNameDistinguisher}`,
          ReviewStreak: dummyReviewStreakDetails,
          UserAuthenticationDatum: dummyUserAuthData,
        };
      }

      it("should reject invalid email addresses", function () {
        return Promise.all(
          INVALID_EMAIL_ADDRESSES.map(function (emailAddress) {
            return User.create(testUser(emailAddress), USER_CREATE_OPTIONS)
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
            return User.create(
              testUser(emailAddress),
              USER_CREATE_OPTIONS
            ).catch(function (err: ValidationError) {
              err.message += `; received >>>${err.errors[0].value}<<<`;
              throw err;
            }).should.be.fulfilled;
          })
        );
      });
    });

    it.skip("should link to one password hash and salt", function () {
      throw new Error("Not implemented yet.");
    });

    it.skip("should link to one preferences document", function () {
      throw new Error("Not implemented yet.");
    });

    it.skip("should have a valid 1:1 relationship w/ `UserPreferences`", function () {
      throw new Error("Not implemented yet.");
    });

    describe("Associations", function () {
      describe("ReviewStreak", function () {
        it("should not exist without a ReviewStreak", function () {
          return User.create(dummyUserDetails).should.be.rejectedWith(
            ValidationError,
            "ReviewStreakId"
          );
        });

        it("should prevent its ReviewStreak from being deleted", async function () {
          let user: User = await User.create(
            dummyUserDetails,
            USER_CREATE_OPTIONS
          );
          let streak = await user.getReviewStreak();
          await ReviewStreak.destroy({
            where: { id: streak.id },
          }).should.be.rejectedWith(ForeignKeyConstraintError, `table "Users"`);
        });
      });

      describe("UserAuthenticationDatum", function () {
        it("should not exist without a UserAuthenticationDatum", function () {
          return User.create(dummyUserDetails).should.be.rejectedWith(
            ValidationError,
            "UserAuthenticationDatumId"
          );
        });

        it.skip("should prevent its UserAuthenticationDatum from being deleted", async function () {
          let user: User = await User.create(
            dummyUserDetails,
            USER_CREATE_OPTIONS
          );
          let streak = await user.getReviewStreak();
          await ReviewStreak.destroy({
            where: { id: streak.id },
          }).should.be.rejectedWith(ForeignKeyConstraintError, `table "Users"`);
        });
      });
    });
  });

  describe.skip("UserAuthenticationDatum", function () {
    it("should have a valid 1:1 association with `User`", function () {
      throw new Error("Not implemented yet.");
    });
  });

  describe.skip("UserPrefences", function () {
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

  describe.skip("UserAuthenticationToken", function () {
    it("should set a default unique token value", function () {
      throw new Error("Not implemented yet.");
    });

    it("should include timestamps on the token", function () {
      throw new Error("Not implemented yet.");
    });
  });

  describe.skip("FlashCard", function () {
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

  describe.skip("Tag", function () {
    it("value should be unique but case-sensitive", function () {
      throw new Error("Not implemented yet.");
    });

    it("should support m:n association with `FlashCard`", function () {
      throw new Error("Not implemented yet.");
    });
  });

  describe("ReviewStreak", function () {
    describe("Associations", function () {
      describe("User", function () {
        it("could exist without a User", function () {
          return ReviewStreak.create(dummyReviewStreakDetails).should.be
            .fulfilled;
        });

        it("should be orphaned if the associated User is deleted", async function () {
          let user: User = await User.create(
            dummyUserDetails,
            USER_CREATE_OPTIONS
          );
          const streakID = (await user.getReviewStreak()).id;
          let streak = await ReviewStreak.findByPk(streakID);
          assert.isNotNull(streak);

          const numUsersDeleted = await User.destroy({
            where: { id: user.id },
          });
          assert.equal(numUsersDeleted, 1);

          streak = await ReviewStreak.findByPk(streakID);
          assert.isNotNull(streak);
        });
      });
    });

    it("should only allow non-negative streak-lengths", function () {
      return ReviewStreak.create({
        lastResetTimestamp: new Date(Date.now()),
        streakLength: -3,
      }).should.be.rejectedWith(ValidationError, "streakLength");
    });

    it("should reject reset times that are in the future", function () {
      return ReviewStreak.create({
        lastResetTimestamp: new Date(Date.now() + 10000),
        streakLength: 4,
      }).should.be.rejectedWith(ValidationError, "lastResetTimestamp");
    });
  });
});
