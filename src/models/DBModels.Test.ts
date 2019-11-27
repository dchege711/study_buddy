/**
 * @description Test relations and properties of the database and its models.
 */

describe("DB.Models", function() {

    describe("User", function() {
        it("should reject incomplete initialization", function() {
            throw new Error("not implemented yet.");
        });
        
        it("should create UUID as primary keys", function() {
            throw new Error("Not implemented yet.");
        });

        it("should should treat the username as case-insensitive", function() {
            throw new Error("Not implemented yet.");
        });

        it("should should treat the email address as case-insensitive", function() {
            throw new Error("Not implemented yet.");
        });

        it("should reject invalid usernames", function() {
            throw new Error("Not implemented yet.");
        });

        it("should not allow duplicate usernames", function() {
            throw new Error("Not implemented yet.");
        });

        it("should not allow duplicate email addresses", function() {
            throw new Error("Not implemented yet.");
        });

        it("should have a timestamp for creation date", function() {
            throw new Error("Not implemented yet.");
        });

        it("should link to one password hash and salt", function() {
            throw new Error("Not implemented yet.");
        });

        it("should link to one preferences document", function() {
            throw new Error("Not implemented yet.");
        });

        it(
            "should have a valid one-to-one relationship w/ `UserAuthenticationData`",
            function() {
            throw new Error("Not implemented yet.");
        });

        it(
            "should have a valid 1:1 relationship w/ `UserPreferences`",
            function() {
            throw new Error("Not implemented yet.");
        });

        it(
            "should have a valid 1:1 relationship w/ `ReviewStreak`",
            function() {
            throw new Error("Not implemented yet.");
        });

    });

    describe("UserAuthenticationData", function() {
        it("should reject incomplete initialization", function() {
            throw new Error("not implemented yet.");
        });
        
        it("should have a valid 1:1 association with `User`", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("UserPrefences", function() {
        it("should reject incomplete initialization", function() {
            throw new Error("not implemented yet.");
        });

        it("should have card privacy set to true by default", function() {
            throw new Error("Not implemented yet.");
        });

        it("should have the daily target set to some positive number", function() {
            throw new Error("Not implemented yet.");
        });

        it("should have a valid 1:1 association with `User`", function() {
            throw new Error("Not implemented yet.");
        });

    });

    describe("UserAuthenticationToken", function() {
        it("should reject incomplete initialization", function() {
            throw new Error("not implemented yet.");
        });

        it("should set a default unique token value", function() {
            throw new Error("Not implemented yet.");
        });

        it("should include timestamps on the token", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("FlashCard", function() {
        it("should reject incomplete initialization", function() {
            throw new Error("Not implemented yet.");
        });
        
        it("should overwrite htmlDescription before saving a card", function() {
            throw new Error("Not implemented yet.");
        });

        it("should limit urgencies to between 0 and 10, inclusive", function() {
            throw new Error("Not implemented yet.");
        });

        it("should respect UserPreferences when `isPublic` is not set", function() {
            throw new Error("Not implemented yet.");
        });

        it("should reject invalid deletion timestamps", function() {
            throw new Error("Not implemented yet.");
        });

        it("should automatically add creation and update timestamps", function() {
            throw new Error("Not implemented yet.");
        });

        it("should support multiple children associations", function() {
            throw new Error("Not implemented yet.");
        });

        it("should support at most one parent association", function() {
            throw new Error("Not implemented yet.");
        });

        it("should support many/no `Tag` associations", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("Tag", function() {
        it("should reject incomplete initialization", function() {
            throw new Error("Not implemented yet.");
        });

        it("value should be unique but case-sensitive", function() {
            throw new Error("Not implemented yet.");
        });

        it("should support m:n association with `FlashCard`", function() {
            throw new Error("Not implemented yet.");
        });
    });

    describe("ReviewStreak", function() {
        it("should reject incomplete initialization", function() {
            throw new Error("Not implemented yet.");
        });

        it("should have a 1:1 association with `User`", function() {
            throw new Error("Not implemented yet.");
        });

        it("should only allow non-negative streak-lengths", function() {
            throw new Error("Not implemented yet.");
        });
    });
});
