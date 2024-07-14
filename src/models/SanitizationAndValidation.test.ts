import { expect } from "chai";

import {
  addCardParamsValidator,
  deleteCardParamsValidator,
  duplicateCardParamsValidator,
  fetchCardParamsValidator,
  flagCardParamsValidator,
  partialCardValidator,
  readPublicCardParamsValidator,
  resetPasswordLinkPathValidator,
  resetPasswordLinkPostParamsValidator,
  resetPasswordRequestParamsValidator,
  restoreCardFromTrashParamsValidator,
  sanitizeCard,
  searchOwnedCardsParamsValidator,
  searchPublicCardsParamsValidator,
  sendValidationEmailParamsValidator,
  streakParamsValidator,
  trashCardParamsValidator,
  userLoginParamsValidator,
  userRegistrationParamsValidator,
  userSettingsParamsValidator,
  verificationPathValidator,
} from "./SanitizationAndValidation";

describe("HTML Transformations", function() {
  it("should convert markdown to HTML", function() {
    const result = sanitizeCard({
      description: "This is a **bold** text",
    });
    expect(result.descriptionHTML).to.eq(
      "<p>This is a <strong>bold</strong> text</p>\n",
    );
  });

  describe("Syntax Highlighting", function() {
    // Helper value for identifying highlighted code blocks.
    const hljsSentinel = "<pre><code class=\"hljs";

    it("should highlight code blocks with a language hint", function() {
      const result = sanitizeCard({
        description: "```js\nlet x = 1;\nconst y = 2;\n```",
      });
      expect(result.descriptionHTML).satisfies(function(s: string) {
        return s.startsWith(hljsSentinel);
      }, result.descriptionHTML);
    });

    it("should highlight code blocks without a language hint", function() {
      const result = sanitizeCard({
        description: "```\nlet x = 1;\nconst y = 2;\n```",
      });
      expect(result.descriptionHTML).satisfies(function(s: string) {
        return s.startsWith(hljsSentinel);
      }, result.descriptionHTML);
    });

    it("should not highlight inline code", function() {
      const { descriptionHTML } = sanitizeCard({
        description: "This is `inline code`",
      });
      expect(descriptionHTML).to.eq(
        "<p>This is <code>inline code</code></p>\n",
      );
    });

    it("should limit highlighting to code blocks", function() {
      const result = sanitizeCard({
        description:
          "```js\nlet x = 1;\n```\nSome `inline code` followed by a code block\n```js\nlet y = 2;\n```",
      });
      expect(result.descriptionHTML).satisfies(function(s: string) {
        return s.startsWith(hljsSentinel);
      }, result.descriptionHTML);
      expect(result.descriptionHTML).to.include(
        `<p>Some <code>inline code</code> followed by a code block</p>\n${hljsSentinel}`,
      );
    });
  });

  describe("LaTeX", function() {
    it("should render LaTeX text", function() {
      const { descriptionHTML } = sanitizeCard({
        description: String.raw`$$e = mc^2$$`,
      });
      expect(descriptionHTML, descriptionHTML).to.include(
        "<span class=\"katex\">",
      );
    });

    it("should not affect non-LaTeX text", function() {
      const description = "This string has no math in it.";
      const { descriptionHTML } = sanitizeCard({ description });
      expect(descriptionHTML, descriptionHTML).to.eq(`<p>${description}</p>\n`);
    });

    it("should not affect non-LaTeX parts of the text", function() {
      const { descriptionHTML } = sanitizeCard({
        description: String.raw`Einstein theorized \(e = mc^2\) in his paper.`,
      });
      expect(descriptionHTML).satisfies(function(s: string) {
        return s.startsWith(`<p>Einstein theorized <eq><span class="katex">`);
      }, descriptionHTML);
    });
  });
});

describe("Input Parsing", function() {
  /**
   * Common valid and invalid inputs for testing.
   */
  const inputs = {
    queryString: {
      valid: ["test", "test card", "test, card", ""],
      invalid: [null, 1, {}],
    },
    limit: {
      valid: [1, 10, 100],
      invalid: [null, "", 0, -1, 1.2, {}, Infinity, JSON.stringify(Infinity)],
    },
    cardIDStrings: {
      valid: [
        "",
        "5f5b6c3e4b4f3c0020b7f3c0",
        "5f5b6c3e4b4f3c0020b7f3c0,5f5b6c3e4b4f3c0020b7f3c1",
      ],
      invalid: [
        null,
        1,
        {},
        { $ne: "" },
        "not-a-valid-id",
        "5f5b6c3e4b4f3c0020b7f3c0,",
        "5f5b6c3e4b4f3c0020b7f3c0,bad,5f5b6c3e4b4f3c0020b7f3c1",
      ],
    },
    cardID: {
      valid: ["5f5b6c3e4b4f3c0020b7f3c0"],
      invalid: [null, "", 1, {}, { $ne: "" }, "not-a-valid-id"],
    },
    cardIDArray: {
      valid: [
        [],
        ["5f5b6c3e4b4f3c0020b7f3c0"],
        ["5f5b6c3e4b4f3c0020b7f3c0", "5f5b6c3e4b4f3c0020b7f3c1"],
      ],
      invalid: [
        null,
        "",
        "5f5b6c3e4b4f3c0020b7f3c0",
        "5f5b6c3e4b4f3c0020b7f3c0,bad,5f5b6c3e4b4f3c0020b7f3c1",
        1,
        {},
        { $ne: "" },
        ["5f5b6c3e4b4f3c0020b7f3c0", "bad", "5f5b6c3e4b4f3c0020b7f3c1"],
      ],
    },
    booleanField: {
      valid: [true, false],
      invalid: [null, "", undefined, 1, 0, "true", "false"],
    },
    optionalBooleanField: {
      valid: [true, false, undefined],
      invalid: [null, "", 1, 0, "true", "false"],
    },
    cardContent: {
      valid: ["", "Sample Content"],
      invalid: [null, {}, { $ne: "" }, 1],
    },
    cardTags: {
      valid: ["", "test", "test,card", "test, card"],
      invalid: [null, {}, { $ne: "" }, "test,card,", 123],
    },
    cardUrgency: {
      valid: [0, 1, 2.6, 10],
      invalid: [null, "", -1, {}, "2", Infinity, JSON.stringify(Infinity)],
    },
    discreteCount: {
      valid: [0, 1, 10, 100],
      invalid: [null, "", -1, 1.2, "1", {}, Infinity, JSON.stringify(Infinity)],
    },
    positiveDiscreteCount: {
      valid: [1, 10, 100],
      invalid: [
        null,
        "",
        -1,
        1.2,
        "1",
        {},
        0,
        Infinity,
        JSON.stringify(Infinity),
      ],
    },
    userName: {
      valid: ["test", "test123"],
      invalid: [null, 123, "test-123", "test.123", { $ne: "" }, "cg"],
    },
    password: {
      valid: [
        "long-password",
        "%$^*&*^%&)(*#@#",
        "0123456789",
        "i have spaces",
      ],
      invalid: [null, 123, { $ne: "" }, "short"],
    },
    email: {
      valid: ["foo@bar.com"],
      invalid: [null, 123, "foo", "foo@bar", { $ne: "" }],
    },
    userNameOrEmail: {
      valid: ["foo@bar.com", "test", "test123"],
      invalid: [
        null,
        123,
        "",
        "foo@bar",
        "test-123",
        "test.123",
        { $ne: "" },
        "cg",
      ],
    },
  };

  describe("readPublicCardParamsValidator", function() {
    it("should accept a valid card ID", function() {
      const { data } = readPublicCardParamsValidator.safeParse({
        cardID: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(data?.cardID).equals("5f5b6c3e4b4f3c0020b7f3c0");
    });

    it("should reject an invalid card ID", function() {
      const { error } = readPublicCardParamsValidator.safeParse({
        cardID: { $ne: "" },
      });
      expect(error).not.undefined;
    });

    it("should reject unknown keys", function() {
      const { error } = readPublicCardParamsValidator.safeParse({
        cardId: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(error).not.undefined;
    });
  });

  const validators = [
    {
      name: "searchPublicCardsParamsValidator",
      validator: searchPublicCardsParamsValidator,
    },
    {
      name: "searchOwnedCardsParamsValidator",
      validator: searchOwnedCardsParamsValidator,
    },
  ];

  validators.forEach(function({ name, validator }) {
    describe(name, function() {
      it("should accept a valid query string and limit", function() {
        const { data } = validator.safeParse({
          queryString: "test",
          limit: 10,
        });
        expect(data).to.deep.equal({ queryString: "test", limit: 10 });
      });

      it("should accept a valid limit", function() {
        inputs.limit.valid.forEach(function(limit) {
          const { data, error } = validator.safeParse({
            queryString: "test",
            limit,
          });
          expect(data, error?.message).deep.equals({
            queryString: "test",
            limit,
          });
        });
      });

      it("should reject an invalid limit", function() {
        inputs.limit.invalid.forEach(function(limit) {
          const { error } = validator.safeParse({
            queryString: "test",
            limit,
          });
          expect(error).not.undefined;
        });
      });

      it("should accept a valid queryString", function() {
        inputs.queryString.valid.forEach(function(queryString) {
          const { data, error } = validator.safeParse({
            queryString,
            limit: 10,
          });
          expect(data, error?.message).deep.equals({
            queryString,
            limit: 10,
          });
        });
      });

      it("should reject an invalid query string", function() {
        inputs.queryString.invalid.forEach(function(queryString) {
          const { error, data } = validator.safeParse({
            queryString,
            limit: 10,
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });

      it("should reject invalid CardIDs", function() {
        inputs.cardIDStrings.invalid.forEach(function(cardIDs) {
          const { error, data } = validator.safeParse({
            queryString: "",
            limit: 10,
            cardIDs,
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });

      it("should accept valid cardIDs", function() {
        inputs.cardIDStrings.valid.forEach(function(cardIDs) {
          const { data, error } = validator.safeParse({
            queryString: "",
            limit: 10,
            cardIDs,
          });
          expect(data, error?.message).to.deep.equal({
            queryString: "",
            limit: 10,
            cardIDs,
          });
        });
      });
    });
  });

  describe("flagCardParamsValidator", function() {
    it("should accept a valid card ID", function() {
      inputs.cardID.valid.forEach(function(cardID) {
        const { data, error } = flagCardParamsValidator.safeParse({
          cardID,
        });
        expect(data, error?.message).to.deep.equal({ cardID });
      });
    });

    it("should reject an invalid card ID", function() {
      inputs.cardID.invalid.forEach(function(cardID) {
        const { error, data } = flagCardParamsValidator.safeParse({
          cardID,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should reject unknown keys", function() {
      const { error } = flagCardParamsValidator.safeParse({
        cardId: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(error).not.undefined;
    });

    it("should accept a valid markedForReview value", function() {
      inputs.optionalBooleanField.valid.forEach(function(markedForReview) {
        const { data, error } = flagCardParamsValidator.safeParse({
          cardID: "5f5b6c3e4b4f3c0020b7f3c0",
          markedForReview,
        });
        expect(data, error?.message).to.deep.equal({
          cardID: "5f5b6c3e4b4f3c0020b7f3c0",
          markedForReview,
        });
      });
    });

    it("should reject an invalid markedForReview value", function() {
      inputs.optionalBooleanField.invalid.forEach(function(markedForReview) {
        const { error, data } = flagCardParamsValidator.safeParse({
          cardID: "5f5b6c3e4b4f3c0020b7f3c0",
          markedForReview,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should accept a valid markedAsDuplicate value", function() {
      inputs.optionalBooleanField.valid.forEach(function(markedAsDuplicate) {
        const { data, error } = flagCardParamsValidator.safeParse({
          cardID: "5f5b6c3e4b4f3c0020b7f3c0",
          markedAsDuplicate,
        });
        expect(data, error?.message).to.deep.equal({
          cardID: "5f5b6c3e4b4f3c0020b7f3c0",
          markedAsDuplicate,
        });
      });
    });

    it("should reject an invalid markedAsDuplicate value", function() {
      inputs.optionalBooleanField.invalid.forEach(function(markedAsDuplicate) {
        const { error, data } = flagCardParamsValidator.safeParse({
          cardID: "5f5b6c3e4b4f3c0020b7f3c0",
          markedAsDuplicate,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });
  });

  describe("fetchCardParamsValidator", function() {
    it("should accept a valid card ID", function() {
      inputs.cardID.valid.forEach(function(cardID) {
        const { data, error } = fetchCardParamsValidator.safeParse({
          cardID,
        });
        expect(data, error?.message).to.deep.equal({ cardID });
      });
    });

    it("should reject an invalid card ID", function() {
      inputs.cardID.invalid.forEach(function(cardID) {
        const { error, data } = fetchCardParamsValidator.safeParse({
          cardID,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should reject unknown keys", function() {
      const { error } = fetchCardParamsValidator.safeParse({
        cardId: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(error).not.undefined;
    });
  });

  describe("addCardParamsValidator", function() {
    it("should accept valid input", function() {
      const { data, error } = addCardParamsValidator.safeParse({
        title: "Test Card",
        description: "This is a test card",
        tags: "test,card",
        urgency: 3,
        isPublic: true,
        parent: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(data, error?.message).to.deep.equal({
        title: "Test Card",
        description: "This is a test card",
        tags: "test,card",
        urgency: 3,
        isPublic: true,
        parent: "5f5b6c3e4b4f3c0020b7f3c0",
      });
    });

    it("should strip out unknown keys", function() {
      const { data } = addCardParamsValidator.safeParse({
        title: "Test Card",
        description: "This is a test card",
        tags: "test,card",
        urgency: 3,
        isPublic: true,
        parent: "5f5b6c3e4b4f3c0020b7f3c0",
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(data).to.deep.equal({
        title: "Test Card",
        description: "This is a test card",
        tags: "test,card",
        urgency: 3,
        isPublic: true,
        parent: "5f5b6c3e4b4f3c0020b7f3c0",
      });
    });

    it("should reject incomplete input", function() {
      const { error } = addCardParamsValidator.safeParse({
        title: "Test Card",
        description: "This is a test card",
        urgency: 3,
        isPublic: true,
      });
      expect(error).not.undefined;
    });

    it("should reject invalid title", function() {
      inputs.cardContent.invalid.forEach(function(title) {
        const { error, data } = addCardParamsValidator.safeParse({
          title,
          description: "This is a test card",
          tags: "test,card",
          urgency: 3,
          isPublic: true,
          parent: "5f5b6c3e4b4f3c0020b7f3c0",
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should reject invalid description", function() {
      inputs.cardContent.invalid.forEach(function(description) {
        const { error, data } = addCardParamsValidator.safeParse({
          title: "Test Card",
          description,
          tags: "test,card",
          urgency: 3,
          isPublic: true,
          parent: "5f5b6c3e4b4f3c0020b7f3c0",
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should reject invalid tags", function() {
      inputs.cardTags.invalid.forEach(function(tags) {
        const { error, data } = addCardParamsValidator.safeParse({
          title: "Test Card",
          description: "This is a test card",
          tags,
          urgency: 3,
          isPublic: true,
          parent: "5f5b6c3e4b4f3c0020b7f3c0",
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should reject invalid urgency", function() {
      inputs.cardUrgency.invalid.forEach(function(urgency) {
        const { error, data } = addCardParamsValidator.safeParse({
          title: "Test Card",
          description: "This is a test card",
          tags: "test,card",
          urgency,
          isPublic: true,
          parent: "5f5b6c3e4b4f3c0020b7f3c0",
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should reject invalid isPublic", function() {
      inputs.booleanField.invalid.forEach(function(isPublic) {
        const { error, data } = addCardParamsValidator.safeParse({
          title: "Test Card",
          description: "This is a test card",
          tags: "test,card",
          urgency: 3,
          isPublic,
          parent: "5f5b6c3e4b4f3c0020b7f3c0",
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should accept an empty parent", function() {
      const { error } = addCardParamsValidator.safeParse({
        title: "Test Card",
        description: "This is a test card",
        tags: "test,card",
        urgency: 3,
        isPublic: true,
        parent: "",
      });
      expect(error).not.undefined;
    });

    it("should reject a missing parent", function() {
      const { error } = addCardParamsValidator.safeParse({
        title: "Test Card",
        description: "This is a test card",
        tags: "test,card",
        urgency: 3,
        isPublic: true,
      });
      expect(error).not.undefined;
    });

    it("should reject an invalid parent", function() {
      inputs.cardID.invalid.forEach(function(parent) {
        const { error, data } = addCardParamsValidator.safeParse({
          title: "Test Card",
          description: "This is a test card",
          tags: "test,card",
          urgency: 3,
          isPublic: true,
          parent,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });
  });

  describe.only("partialCardValidator", function() {
    it("should accept valid _id", function() {
      inputs.cardID.valid.forEach(function(_id) {
        const { data, error } = partialCardValidator.safeParse({ _id });
        expect(data, error?.message).to.deep.equal({ _id });
      });
    });

    it("should strip out unknown keys", function() {
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        cardID: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
      });
    });

    it("should reject empty input", function() {
      const { error } = partialCardValidator.safeParse({});
      expect(error).not.undefined;
    });

    it("should reject invalid _id", function() {
      inputs.cardID.invalid.forEach(function(_id) {
        const { error, data } = partialCardValidator.safeParse({ _id });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should accept valid title", function() {
      inputs.cardContent.valid.forEach(function(title) {
        const { data, error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          title,
        });
        expect(data, error?.message).to.deep.equal({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          title,
        });
      });
    });

    it("should reject invalid title", function() {
      inputs.cardContent.invalid.forEach(function(title) {
        const { error, data } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          title,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should accept valid description", function() {
      inputs.cardContent.valid.forEach(function(description) {
        const { data, error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          description,
        });
        expect(data, error?.message).to.deep.equal({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          description,
        });
      });
    });

    it("should reject invalid description", function() {
      inputs.cardContent.invalid.forEach(function(description) {
        const { error, data } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          description,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should accept valid tags", function() {
      inputs.cardTags.valid.forEach(function(tags) {
        const { data, error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          tags,
        });
        expect(data, error?.message).to.deep.equal({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          tags,
        });
      });
    });

    it("should reject invalid tags", function() {
      inputs.cardTags.invalid.forEach(function(tags) {
        const { error, data } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          tags,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should accept valid urgency", function() {
      inputs.cardUrgency.valid.forEach(function(urgency) {
        const { data, error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          urgency,
        });
        expect(data, error?.message).to.deep.equal({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          urgency,
        });
      });
    });

    it("should reject invalid urgency", function() {
      inputs.cardUrgency.invalid.forEach(function(urgency) {
        const { error, data } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          urgency,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should drop metadataIndex", function() {
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        metadataIndex: 1,
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
      });
    });

    it("should drop createdById", function() {
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        createdById: 1,
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
      });
    });

    it("should accept valid isPublic", function() {
      inputs.optionalBooleanField.valid.forEach(function(isPublic) {
        const { data, error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          isPublic,
        });
        expect(data, error?.message).to.deep.equal({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          isPublic,
        });
      });
    });

    it("should reject invalid isPublic", function() {
      inputs.optionalBooleanField.invalid.forEach(function(isPublic) {
        const { error, data } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          isPublic,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should accept valid lastReviewed", function() {
      const lastReviewed = JSON.stringify(new Date());
      // const lastReviewed = "2024-07-14T15:05:22.087Z";
      const { data, error } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        lastReviewed,
      });
      expect(data, error?.message).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        lastReviewed,
      });
    });

    it("should accept valid parent", function() {
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        parent: "5f5b6c3e4b4f3c0020b7f3c1",
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        parent: "5f5b6c3e4b4f3c0020b7f3c1",
      });
    });

    it("should reject invalid parent", function() {
      inputs.cardID.invalid.forEach(function(parent) {
        const { error, data } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          parent,
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should accept valid numChildren", function() {
      inputs.discreteCount.valid.forEach(function(numChildren) {
        const { data, error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          numChildren,
        });
        expect(data, error?.message).to.deep.equal({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          numChildren,
        });
      });

      it("should reject invalid numChildren", function() {
        inputs.discreteCount.invalid.forEach(function(numChildren) {
          const { error, data } = partialCardValidator.safeParse({
            _id: "5f5b6c3e4b4f3c0020b7f3c0",
            numChildren,
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });

      it("should drop idsOfUsersWithCopy", function() {
        const { data } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          idsOfUsersWithCopy: "5f5b6c3e4b4f3c0020b7f3c1",
        });
        expect(data).to.deep.equal({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
        });
      });

      it("should accept valid numTimesMarkedAsDuplicate", function() {
        inputs.discreteCount.valid.forEach(function(numTimesMarkedAsDuplicate) {
          const { data, error } = partialCardValidator.safeParse({
            _id: "5f5b6c3e4b4f3c0020b7f3c0",
            numTimesMarkedAsDuplicate,
          });
          expect(data, error?.message).to.deep.equal({
            _id: "5f5b6c3e4b4f3c0020b7f3c0",
            numTimesMarkedAsDuplicate,
          });
        });

        it("should reject invalid numTimesMarkedAsDuplicate", function() {
          inputs.discreteCount.invalid.forEach(
            function(numTimesMarkedAsDuplicate) {
              const { error, data } = partialCardValidator.safeParse({
                _id: "5f5b6c3e4b4f3c0020b7f3c0",
                numTimesMarkedAsDuplicate,
              });
              expect(error, JSON.stringify(data)).not.undefined;
            },
          );
        });

        it("should accept valid numTimesMarkedForReview", function() {
          inputs.discreteCount.valid.forEach(function(numTimesMarkedForReview) {
            const { data, error } = partialCardValidator.safeParse({
              _id: "5f5b6c3e4b4f3c0020b7f3c0",
              numTimesMarkedForReview,
            });
            expect(data, error?.message).to.deep.equal({
              _id: "5f5b6c3e4b4f3c0020b7f3c0",
              numTimesMarkedForReview,
            });
          });
        });

        it("should reject invalid numTimesMarkedForReview", function() {
          inputs.discreteCount.invalid.forEach(
            function(numTimesMarkedForReview) {
              const { error, data } = partialCardValidator.safeParse({
                _id: "5f5b6c3e4b4f3c0020b7f3c0",
                numTimesMarkedForReview,
              });
              expect(error, JSON.stringify(data)).not.undefined;
            },
          );
        });

        it("should ignore createdAt", function() {
          const createdAt = new Date();
          const { data } = partialCardValidator.safeParse({
            _id: "5f5b6c3e4b4f3c0020b7f3c0",
            createdAt,
          });
          expect(data).to.deep.equal({
            _id: "5f5b6c3e4b4f3c0020b7f3c0",
          });
        });

        it("should ignore updatedAt", function() {
          const updatedAt = new Date();
          const { data } = partialCardValidator.safeParse({
            _id: "5f5b6c3e4b4f3c0020b7f3c0",
            updatedAt,
          });
          expect(data).to.deep.equal({
            _id: "5f5b6c3e4b4f3c0020b7f3c0",
          });
        });
      });
    });

    const trashOrDeleteCardValidators = [
      {
        name: "trashCardParamsValidator",
        validator: trashCardParamsValidator,
      },
      {
        name: "restoreCardFromTrashParamsValidator",
        validator: restoreCardFromTrashParamsValidator,
      },
      {
        name: "deleteCardParamsValidator",
        validator: deleteCardParamsValidator,
      },
    ];
    trashOrDeleteCardValidators.forEach(function({ name, validator }) {
      describe(name, function() {
        it("should accept a valid card ID", function() {
          const { data } = validator.safeParse({
            _id: "5f5b6c3e4b4f3c0020b7f3c0",
          });
          expect(data?._id).equals("5f5b6c3e4b4f3c0020b7f3c0");
        });

        it("should reject an invalid card ID", function() {
          inputs.cardID.invalid.forEach(function(_id) {
            const { error, data } = validator.safeParse({
              _id,
            });
            expect(error, JSON.stringify(data)).not.undefined;
          });
        });

        it("should reject unknown keys", function() {
          const { error } = validator.safeParse({
            cardID: "5f5b6c3e4b4f3c0020b7f3c0",
          });
          expect(error).not.undefined;
        });
      });
    });

    describe("duplicateCardParamsValidator", function() {
      it("should accept a valid card ID", function() {
        const { data } = duplicateCardParamsValidator.safeParse({
          cardID: "5f5b6c3e4b4f3c0020b7f3c0",
        });
        expect(data?.cardID).equals("5f5b6c3e4b4f3c0020b7f3c0");
      });

      it("should reject an invalid card ID", function() {
        inputs.cardID.invalid.forEach(function(cardID) {
          const { error, data } = duplicateCardParamsValidator.safeParse({
            cardID,
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });

      it("should reject unknown keys", function() {
        const { error } = duplicateCardParamsValidator.safeParse({
          cardId: "5f5b6c3e4b4f3c0020b7f3c0",
        });
        expect(error).not.undefined;
      });
    });

    describe("streakParamsValidator", function() {
      it("should accept valid card IDs", function() {
        inputs.cardIDArray.valid.forEach(function(cardIDs) {
          const { data, error } = streakParamsValidator.safeParse({
            cardIDs,
          });
          expect(data, error?.message).to.deep.equal({ cardIDs });
        });
      });

      it("should reject invalid card IDs", function() {
        inputs.cardIDArray.invalid.forEach(function(cardIDs) {
          const { error, data } = streakParamsValidator.safeParse({
            cardIDs,
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });

      it("should reject unknown keys", function() {
        const { error } = streakParamsValidator.safeParse({
          cardIds: ["5f5b6c3e4b4f3c0020b7f3c0"],
        });
        expect(error).not.undefined;
      });
    });

    describe("userSettingsParamsValidator", function() {
      it("should accept valid cardsAreByDefaultPrivate", function() {
        const { data, error } = userSettingsParamsValidator.safeParse({
          cardsAreByDefaultPrivate: "on",
        });
        expect(data, error?.message).deep.equals({
          cardsAreByDefaultPrivate: "on",
        });
      });

      it("should reject invalid cardsAreByDefaultPrivate", function() {
        [null, "true", true, 1, "off", false].forEach(
          function(cardsAreByDefaultPrivate) {
            const { error } = userSettingsParamsValidator.safeParse({
              cardsAreByDefaultPrivate,
            });
            expect(error).not.undefined;
          },
        );
      });

      it("should accept valid dailyTarget", function() {
        inputs.positiveDiscreteCount.valid.forEach(function(dailyTarget) {
          const { data, error } = userSettingsParamsValidator.safeParse({
            dailyTarget,
          });
          expect(data, error?.message).to.deep.equal({ dailyTarget });
        });
      });

      it("should reject invalid dailyTarget", function() {
        inputs.positiveDiscreteCount.invalid.forEach(function(dailyTarget) {
          const { error, data } = streakParamsValidator.safeParse({
            dailyTarget,
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });

      it("should ignore unknown keys", function() {
        const { data } = userSettingsParamsValidator.safeParse({
          cardsAreByDefaultPrivate: "on",
          invalid: true,
        });
        expect(data).deep.equals({
          cardsAreByDefaultPrivate: "on",
        });
      });
    });

    describe("userLoginParamsValidator", function() {
      it("should reject missing email address", function() {
        const { error } = userLoginParamsValidator.safeParse({
          password: "password",
        });
        expect(error).not.undefined;
      });

      it("should reject missing password", function() {
        const { error } = userLoginParamsValidator.safeParse({
          username_or_email: "foo@bar.com",
        });
        expect(error).not.undefined;
      });

      it("should accept valid username_or_email", function() {
        inputs.userNameOrEmail.valid.forEach(function(username_or_email) {
          const { data, error } = userLoginParamsValidator.safeParse({
            username_or_email,
            password: "password",
          });
          expect(data, error?.message).deep.equals({
            username_or_email,
            password: "password",
          });
        });
      });

      it("should reject invalid username_or_email", function() {
        inputs.userNameOrEmail.invalid.forEach(function(username_or_email) {
          const { error, data } = userLoginParamsValidator.safeParse({
            username_or_email,
            password: "password",
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });

      it("should accept valid password", function() {
        inputs.password.valid.forEach(function(password) {
          const { data, error } = userLoginParamsValidator.safeParse({
            username_or_email: "foo",
            password,
          });
          expect(data, error?.message).deep.equals({
            username_or_email: "foo",
            password,
          });
        });
      });

      it("should reject invalid password", function() {
        inputs.password.invalid.forEach(function(password) {
          const { error, data } = userLoginParamsValidator.safeParse({
            username_or_email: "foo",
            password,
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });
    });

    describe("userRegistrationParamsValidator", function() {
      it("should reject missing email address", function() {
        const { error } = userRegistrationParamsValidator.safeParse({
          password: "long-password",
          username: "foobar",
        });
        expect(error).not.undefined;
      });

      it("should reject missing password", function() {
        const { error } = userRegistrationParamsValidator.safeParse({
          email: "foo@bar.com",
          username: "foobar",
        });
        expect(error).not.undefined;
      });

      it("should reject missing username", function() {
        const { error } = userRegistrationParamsValidator.safeParse({
          email: "foo@bar.com",
          password: "long-password",
        });
        expect(error).not.undefined;
      });

      it("should accept valid email", function() {
        inputs.email.valid.forEach(function(email) {
          const { data, error } = userRegistrationParamsValidator.safeParse({
            email,
            password: "long-password",
            username: "foobar",
          });
          expect(data, error?.message).deep.equals({
            email,
            password: "long-password",
            username: "foobar",
          });
        });
      });

      it("should reject invalid email", function() {
        inputs.email.invalid.forEach(function(email) {
          const { error, data } = userRegistrationParamsValidator.safeParse({
            email,
            password: "long-password",
            username: "foobar",
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });

      it("should reject invalid password", function() {
        inputs.password.invalid.forEach(function(password) {
          const { error, data } = userRegistrationParamsValidator.safeParse({
            email: "foo@bar.com",
            password,
            username: "foobar",
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });

      it("should reject invalid username", function() {
        inputs.userName.invalid.forEach(function(username) {
          const { error, data } = userRegistrationParamsValidator.safeParse({
            email: "foo@bar.com",
            password: "long-password",
            username,
          });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });
    });

    const sendEmailEndpointValidators = [
      {
        name: "sendValidationEmailParamsValidator",
        validator: sendValidationEmailParamsValidator,
      },
      {
        name: "resetPasswordRequestParamsValidator",
        validator: resetPasswordRequestParamsValidator,
      },
    ];
    sendEmailEndpointValidators.forEach(function({ name, validator }) {
      describe(name, function() {
        it("should accept valid email", function() {
          inputs.email.valid.forEach(function(email) {
            const { data, error } = validator.safeParse({
              email,
            });
            expect(data, error?.message).deep.equals({ email });
          });
        });

        it("should reject invalid email", function() {
          inputs.email.invalid.forEach(function(email) {
            const { error, data } = validator.safeParse({ email });
            expect(error, JSON.stringify(data)).not.undefined;
          });
        });
      });
    });

    describe("resetPasswordLinkPostParamsValidator", function() {
      it("should accept matching passwords", function() {
        const { data } = resetPasswordLinkPostParamsValidator.safeParse({
          password_1: "long-password",
          password_2: "long-password",
        });
        expect(data).deep.equals({
          password_1: "long-password",
          password_2: "long-password",
        });
      });

      it("should reject mismatched passwords", function() {
        const { error } = resetPasswordLinkPostParamsValidator.safeParse({
          password_1: "long-password",
          password_2: "different-password",
        });
        expect(error).not.undefined;
      });

      it("should reject missing password_1", function() {
        const { error } = resetPasswordLinkPostParamsValidator.safeParse({
          password_2: "long-password",
        });
        expect(error).not.undefined;
      });

      it("should reject missing password_2", function() {
        const { error } = resetPasswordLinkPostParamsValidator.safeParse({
          password_1: "long-password",
        });
        expect(error).not.undefined;
      });

      it("should reject invalid passwords", function() {
        inputs.password.invalid.forEach(function(password) {
          const { error, data } = resetPasswordLinkPostParamsValidator
            .safeParse({
              password_1: password,
              password_2: password,
            });
          expect(error, JSON.stringify(data)).not.undefined;
        });
      });
    });

    describe("verificationPathValidator", function() {
      it("should accept valid path", function() {
        const { data } = verificationPathValidator.safeParse(
          "/verify-account/32alphanumericcharsinlowercase32",
        );
        expect(data).deep.equals(
          "/verify-account/32alphanumericcharsinlowercase32",
        );
      });

      it("should reject invalid path", function() {
        [
          "/verify-account/32----------------------------32",
          "/verify-account/not32characterslong",
        ].forEach(
          function(path) {
            const { error, data } = verificationPathValidator.safeParse(path);
            expect(error, JSON.stringify(data)).not.undefined;
          },
        );
      });
    });

    describe("resetPasswordLinkPathValidator", function() {
      it("should accept valid path", function() {
        const { data } = resetPasswordLinkPathValidator.safeParse(
          "/reset-password-link/50alphanumericcharsinlowercase12345678901234567850",
        );
        expect(data).deep.equals(
          "/reset-password-link/50alphanumericcharsinlowercase12345678901234567850",
        );
      });

      it("should reject invalid path", function() {
        [
          "/reset-password-link/50----------------------------12345678901234567850",
          "/reset-password-link/not50characterslong",
        ].forEach(
          function(path) {
            const { error, data } = resetPasswordLinkPathValidator.safeParse(
              path,
            );
            expect(error, JSON.stringify(data)).not.undefined;
          },
        );
      });
    });
  });
});
