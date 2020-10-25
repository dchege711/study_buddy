describe.skip("FlashCardModel", function () {
  describe("create", function () {
    it("should have stored the card in the db on return.", function () {
      throw new Error("Test not implemented.");
    });

    it("should sanitize user input.", function () {
      throw new Error("Test not implemented.");
    });

    it("should gracefully handle input that can't be stored.", function () {
      throw new Error("Test not implemented.");
    });

    it("should not overwrite existing tags.", function () {
      throw new Error("Test not implemented.");
    });
  });

  describe("createMany", function () {
    it("should persist all cards before returning.", function () {
      throw new Error("Test not implemented.");
    });
  });

  describe("read", function () {
    it("should gracefully handle non-existent cards.", function () {
      throw new Error("Test not implemented.");
    });

    it("should find cards that are exact matches", function () {
      throw new Error("Test not implemented.");
    });

    it("should convert `Tag` associations into a string array", function () {
      throw new Error("Test not implemented.");
    });

    it("should not expose inner db structure to the client", function () {
      throw new Error("Test not implemented.");
    });

    it.skip("should read all cards belonging to the user.", function () {
      throw new Error("Not implemented yet.");
    });
  });

  describe("update", function () {
    it.skip("should gracefully fail if the card is actually new.", function () {
      throw new Error("Not implemented yet.");
    });

    it("should have persisted changes on returning.", function () {
      throw new Error("Test not implemented.");
    });

    it("should sanitize user input.", function () {
      throw new Error("Test not implemented.");
    });
  });

  describe("search", function () {
    it("should sanitize user input.", function () {
      throw new Error("Test not implemented.");
    });

    it("should locate substrings that match the search.", function () {
      throw new Error("Test not implemented.");
    });

    it("should return partial cards as opposed to full cards.", function () {
      throw new Error("Test not implemented.");
    });
  });

  describe("publicSearch", function () {
    it("should limit search results to public cards.", function () {
      throw new Error("Test not implemented.");
    });
  });

  describe("readPublicCard", function () {
    // Same as those of `publicSearch`
  });

  describe("duplicateCard", function () {
    it("should no-op if the user already owns the card.", function () {
      throw new Error("Test not implemented.");
    });

    it("should create a parent-child relationship.", function () {
      throw new Error("Test not implemented.");
    });
  });

  describe("flagCard", function () {
    it("should increment the relevant attribute by 1 each time", function () {
      throw new Error("Test not implemented.");
    });

    it("should suppress the card from public search.", function () {
      throw new Error("Test not implemented.");
    });

    it("should not suppress the card from private search.", function () {
      throw new Error("Test not implemented.");
    });
  });

  describe("getTagGroupings", function () {
    it("should fetch all tag groupings (private and public cards)", function () {
      throw new Error("Test not implemented.");
    });

    it("should gracefully handle zero tags.", function () {
      throw new Error("Test not implemented.");
    });
  });

  describe("trashCard", function () {
    it("should not delete the card.", function () {
      throw new Error("Test not implemented.");
    });

    it("should suppress the card from public search.", function () {
      throw new Error("Test not implemented.");
    });

    it("should suppress the card from private search.", function () {
      throw new Error("Test not implemented.");
    });
  });

  describe("restoreCardFromTrash", function () {
    it("should not create a new card.", function () {
      throw new Error("Test not implemented.");
    });

    it("should show the card in public search.", function () {
      throw new Error("Test not implemented.");
    });

    it("should show the card in private search.", function () {
      throw new Error("Test not implemented.");
    });
  });

  describe("permanentlyDeleteCard", function () {
    it("should not delete child cards.", function () {
      throw new Error("Test not implemented.");
    });

    it("should leave `Tags` that are orphaned intact.", function () {
      throw new Error("Test not implemented.");
    });
  });
});
