"use strict";

import { Suite } from "mocha";

import * as LogInUtilities from "../../../models/LogInUtilities";
import { addPublicUser } from "../../../models/Miscellaneous";
import { mongooseConnection } from "../../../models/MongooseClient";

describe("Test LoginUtilities\n", function() {
  describe("when signing up new users", function(this: Suite) {
    this.timeout(5000); // These tests may run slower than 2s in CI.

    beforeEach(function() {
      return addPublicUser();
    });

    it("should reject an incorrect email address", function(done) {
      LogInUtilities
        .registerUserAndPassword({
          username: "sample-user",
          password: "dummy_password",
          email: "c13u.study.buddygmail.com",
        })
        .then(function(signupResult) {
          done(new Error(signupResult));
        })
        .catch(function() {
          done();
        });
    });

    it("should reject an incorrect username", function(done) {
      LogInUtilities
        .registerUserAndPassword({
          username: "!not$alpha*numeric",
          password: "dummy_password",
          email: "c13u.study.buddygmail.com",
        })
        .then(function(signupResult) {
          done(new Error(signupResult));
        })
        .catch(function() {
          done();
        });
    });

    describe("when a valid user already exists", function() {
      beforeEach(function() {
        return LogInUtilities
          .registerUserAndPassword({
            username: "alice",
            password: "test_dummy_password",
            email: "test@example.com",
          });
      });

      // Remarks: a.b@gmail.com and ab@gmail.com will be regarded as different emails!
      it(
        "should prevent other users from using the same email",
        function(done) {
          LogInUtilities
            .registerUserAndPassword({
              username: "bob",
              password: "test_dummy_password",
              email: "test@example.com",
            })
            .then(function(signupResult) {
              done(new Error(signupResult));
            })
            .catch(function() {
              done();
            });
        },
      );

      it(
        "should prevent other users from using the same username",
        function(done) {
          LogInUtilities
            .registerUserAndPassword({
              username: "alice",
              password: "test_dummy_password",
              email: "bob@example.com",
            })
            .then(function(signupResult) {
              done(new Error(signupResult));
            })
            .catch(function() {
              done();
            });
        },
      );
    });
  });
});
