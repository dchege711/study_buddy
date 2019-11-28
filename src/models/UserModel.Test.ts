import * as assert from "assert";

import * as UserModel from "./UserModel";

describe("UserModel", function() {

    describe("sendAccountValidationLink", function() {
        it("should not send emails to addresses that don't hae an account", function() {
            throw new Error("Not implemented yet.");
        })
    });

    describe("validateAccount", function() {
        it("should only validate accounts using active tokens.", function() {
            throw new Error("Not implemented yet.");
        });

        it("should only accept a validation token once.", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("registerUser", function() {
        it("should not store passwords as plain text.", function() {
            throw new Error("Not implemented yet.");
        });

        it("should initialize all 1:1 relationships to the `User` row.", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("authenticateUser", function() {
        it(
            "should authenticate users with their username(CI) & password", 
            function() {
                throw new Error("Not implemented yet.");
            }
        );

        it(
            "should authenticate users with their email(CI) & password", 
            function() {
                throw new Error("Not implemented yet.");
            }
        );

        it("should treat passwords as case-sensitive.", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("authenticateByToken", function() {
        it("should authenticate users with a valid token.", function() {
            throw new Error("Not implemented yet.");
        });

        it("should reject invalid login tokens.", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("deleteSessionToken", function() {
        it("should deny authentication for deleted tokens.", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("sendResetLink", function() {
        it("should only send reset emails to validated account bearers.", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("validatePasswordResetLink", function() {
        it("should reject already used links.", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("resetPassword", function() {
        it("should reject already used links.", function() {
            throw new Error("Not implemented yet.");
        });

        it("should prevent signins using the old password.", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("updateUserPreferences", function() {
        it("should overwrite the old `UserPreferences`.", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("updateStreak", function() {
        it("should correctly increment the list of cards reviewed.", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("deleteAccount", function() {
        it("should delete the user's account.", function() {
            throw new Error("Not implemented yet.");
        });

        it("should delete all the user's associated data.", function() {
            // FlashCard, UserAuthenticationData, UserPreferences, ReviewStreak
            // UserAuthenticationToken
            throw new Error("Not implemented yet.");
        });
    });

    describe("writeCardsToJSONFile", function() {
        it("should include all the cards that the user owns.", function() {
            throw new Error("Not implemented yet.");
        });
    });

});