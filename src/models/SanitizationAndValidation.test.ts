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

      it("should reject a negative limit", function() {
        const { error } = validator.safeParse({
          queryString: "test",
          limit: -1,
        });
        expect(error).not.undefined;
      });

      it("should reject a zero limit", function() {
        const { error } = validator.safeParse({
          queryString: "test",
          limit: 0,
        });
        expect(error).not.undefined;
      });

      it("should reject an invalid query string", function() {
        const { error } = validator.safeParse({
          queryString: { $ne: "" },
          limit: 10,
        });
        expect(error).not.undefined;
      });

      it("should reject a non-numeric limit", function() {
        const { error } = validator.safeParse({
          queryString: "test",
          limit: "10",
        });
        expect(error).not.undefined;
      });

      it("should accept an empty query string", function() {
        const { data } = validator.safeParse({
          queryString: "",
          limit: 10,
        });
        expect(data).to.deep.equal({ queryString: "", limit: 10 });
      });

      it("should accept single card ID", function() {
        const { data } = validator.safeParse({
          queryString: "test",
          limit: 10,
          cardIDs: "5f5b6c3e4b4f3c0020b7f3c0",
        });
        expect(data).to.deep.equal({
          queryString: "test",
          limit: 10,
          cardIDs: "5f5b6c3e4b4f3c0020b7f3c0",
        });
      });

      it("should accept multiple comma-delimited card IDs", function() {
        const { data } = validator.safeParse({
          queryString: "test",
          limit: 10,
          cardIDs: "5f5b6c3e4b4f3c0020b7f3c0,5f5b6c3e4b4f3c0020b7f3c1",
        });
        expect(data).to.deep.equal({
          queryString: "test",
          limit: 10,
          cardIDs: "5f5b6c3e4b4f3c0020b7f3c0,5f5b6c3e4b4f3c0020b7f3c1",
        });
      });

      it("should reject a single invalid card ID", function() {
        const { error } = validator.safeParse({
          queryString: "test",
          limit: 10,
          cardIDs: { $ne: "" },
        });
        expect(error).not.undefined;
      });

      it("should reject a malformed card IDs string", function() {
        const { error } = validator.safeParse({
          queryString: "test",
          limit: 10,
          cardIDs: "5f5b6c3e4b4f3c0020b7f3c0,",
        });
        expect(error).not.undefined;
      });

      it("should reject an invalid card ID in a list", function() {
        const { error } = validator.safeParse({
          queryString: "test",
          limit: 10,
          cardIDs: "5f5b6c3e4b4f3c0020b7f3c0,bad,5f5b6c3e4b4f3c0020b7f3c1",
        });
        expect(error).not.undefined;
      });
    });
  });

  describe("flagCardParamsValidator", function() {
    it("should accept a valid card ID", function() {
      const { data } = flagCardParamsValidator.safeParse({
        cardID: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(data?.cardID).equals("5f5b6c3e4b4f3c0020b7f3c0");
    });

    it("should reject an invalid card ID", function() {
      const { error } = flagCardParamsValidator.safeParse({
        cardID: { $ne: "" },
      });
      expect(error).not.undefined;
    });

    it("should reject unknown keys", function() {
      const { error } = flagCardParamsValidator.safeParse({
        cardId: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(error).not.undefined;
    });

    it("should accept a valid markedForReview value", function() {
      const { data } = flagCardParamsValidator.safeParse({
        cardID: "5f5b6c3e4b4f3c0020b7f3c0",
        markedForReview: true,
      });
      expect(data?.markedForReview).equals(true);
    });

    it("should accept a valid markedAsDuplicate value", function() {
      const { data } = flagCardParamsValidator.safeParse({
        cardID: "5f5b6c3e4b4f3c0020b7f3c0",
        markedAsDuplicate: true,
      });
      expect(data?.markedAsDuplicate).equals(true);
    });
  });

  describe("fetchCardParamsValidator", function() {
    it("should accept a valid card ID", function() {
      const { data } = fetchCardParamsValidator.safeParse({
        cardID: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(data?.cardID).equals("5f5b6c3e4b4f3c0020b7f3c0");
    });

    it("should reject an invalid card ID", function() {
      const { error } = fetchCardParamsValidator.safeParse({
        cardID: { $ne: "" },
      });
      expect(error).not.undefined;
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
      const { error } = addCardParamsValidator.safeParse({
        title: 1234,
        description: "This is a test card",
        tags: "test,card",
        urgency: 3,
        isPublic: true,
        parent: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(error).not.undefined;
    });

    it("should reject invalid description", function() {
      const { error } = addCardParamsValidator.safeParse({
        title: "Test Card",
        description: 1234,
        tags: "test,card",
        urgency: 3,
        isPublic: true,
        parent: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(error).not.undefined;
    });

    it("should reject invalid tags", function() {
      const { error } = addCardParamsValidator.safeParse({
        title: "Test Card",
        description: "This is a test card",
        tags: 1234,
        urgency: 3,
        isPublic: true,
        parent: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(error).not.undefined;
    });

    it("should reject invalid urgency", function() {
      const { error } = addCardParamsValidator.safeParse({
        title: "Test Card",
        description: "This is a test card",
        tags: "test,card",
        urgency: "3",
        isPublic: true,
        parent: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(error).not.undefined;
    });

    it("should reject invalid isPublic", function() {
      const { error } = addCardParamsValidator.safeParse({
        title: "Test Card",
        description: "This is a test card",
        tags: "test,card",
        urgency: 3,
        isPublic: "true",
        parent: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(error).not.undefined;
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
      const { error } = addCardParamsValidator.safeParse({
        title: "Test Card",
        description: "This is a test card",
        tags: "test,card",
        urgency: 3,
        isPublic: true,
        parent: "not-a-valid-id",
      });
      expect(error).not.undefined;
    });
  });

  describe("partialCardValidator", function() {
    it("should accept valid _id", function() {
      const { data, error } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
      });
      expect(data, error?.message).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
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
      [null, 1234, { $ne: "" }].forEach(function(_id) {
        const { error } = partialCardValidator.safeParse({ _id });
        expect(error).not.undefined;
      });
    });

    it("should accept valid title", function() {
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        title: "Test Card",
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        title: "Test Card",
      });
    });

    it("should reject invalid title", function() {
      [null, 1234, { $ne: "" }].forEach(function(title) {
        const { error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          title,
        });
        expect(error).not.undefined;
      });
    });

    it("should accept valid description", function() {
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        description: "This is a test card",
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        description: "This is a test card",
      });
    });

    it("should reject invalid description", function() {
      [null, 1234, { $ne: "" }].forEach(function(description) {
        const { error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          description,
        });
        expect(error).not.undefined;
      });
    });

    it("should accept valid tags", function() {
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        tags: "test,card",
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        tags: "test,card",
      });
    });

    it("should reject invalid tags", function() {
      [null, 1234, { $ne: "" }].forEach(function(tags) {
        const { error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          tags,
        });
        expect(error).not.undefined;
      });
    });

    it("should accept valid urgency", function() {
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        urgency: 3,
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        urgency: 3,
      });
    });

    it("should reject invalid urgency", function() {
      [null, "3", -3].forEach(function(urgency) {
        const { error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          urgency,
        });
        expect(error).not.undefined;
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
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        isPublic: true,
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        isPublic: true,
      });
    });

    it("should reject invalid isPublic", function() {
      [null, "true", 1].forEach(function(isPublic) {
        const { error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          isPublic,
        });
        expect(error).not.undefined;
      });
    });

    it("should accept valid lastReviewed", function() {
      const lastReviewed = new Date();
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        lastReviewed,
      });
      expect(data).to.deep.equal({
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
      [null, "not-an-id", { $ne: "" }].forEach(function(parent) {
        const { error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          parent,
        });
        expect(error).not.undefined;
      });
    });

    it("should accept valid numChildren", function() {
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        numChildren: 0,
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        numChildren: 0,
      });
    });

    it("should reject invalid numChildren", function() {
      [null, "3", -3].forEach(function(numChildren) {
        const { error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          numChildren,
        });
        expect(error).not.undefined;
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
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        numTimesMarkedAsDuplicate: 0,
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        numTimesMarkedAsDuplicate: 0,
      });
    });

    it("should reject invalid numTimesMarkedAsDuplicate", function() {
      [null, "3", -3].forEach(function(numTimesMarkedAsDuplicate) {
        const { error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          numTimesMarkedAsDuplicate,
        });
        expect(error).not.undefined;
      });
    });

    it("should accept valid numTimesMarkedForReview", function() {
      const { data } = partialCardValidator.safeParse({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        numTimesMarkedForReview: 0,
      });
      expect(data).to.deep.equal({
        _id: "5f5b6c3e4b4f3c0020b7f3c0",
        numTimesMarkedForReview: 0,
      });
    });

    it("should reject invalid numTimesMarkedForReview", function() {
      [null, "3", -3].forEach(function(numTimesMarkedForReview) {
        const { error } = partialCardValidator.safeParse({
          _id: "5f5b6c3e4b4f3c0020b7f3c0",
          numTimesMarkedForReview,
        });
        expect(error).not.undefined;
      });
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
        [null, "invalid", { $ne: "" }].forEach(function(_id) {
          const { error } = validator.safeParse({
            _id,
          });
          expect(error).not.undefined;
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
      [null, "invalid", { $ne: "" }].forEach(function(cardID) {
        const { error } = duplicateCardParamsValidator.safeParse({
          cardID,
        });
        expect(error).not.undefined;
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
      const { data } = streakParamsValidator.safeParse({
        cardIDs: ["5f5b6c3e4b4f3c0020b7f3c0"],
      });
      expect(data?.cardIDs).deep.equals(["5f5b6c3e4b4f3c0020b7f3c0"]);
    });

    it("should reject invalid card IDs", function() {
      [
        null,
        "5f5b6c3e4b4f3c0020b7f3c0",
        "5f5b6c3e4b4f3c0020b7f3c0,5f5b6c3e4b4f3c0020b7f3c1",
        ["5f5b6c3e4b4f3c0020b7f3c0", "invalid"],
        { $ne: "" },
        [{ $ne: "" }],
      ].forEach(function(cardIDs) {
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
      const { data } = userSettingsParamsValidator.safeParse({
        dailyTarget: 10,
      });
      expect(data).deep.equals({ dailyTarget: 10 });
    });

    it("should reject invalid dailyTarget", function() {
      [null, "10", -10, 0].forEach(function(dailyTarget) {
        const { error } = userSettingsParamsValidator.safeParse({
          dailyTarget,
        });
        expect(error).not.undefined;
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

    it("should accept valid email address", function() {
      const { data } = userLoginParamsValidator.safeParse({
        username_or_email: "foo@bar.com",
        password: "password",
      });
      expect(data).deep.equals({
        username_or_email: "foo@bar.com",
        password: "password",
      });
    });

    it("should accept valid username", function() {
      const { data } = userLoginParamsValidator.safeParse({
        username_or_email: "foobar",
        password: "password",
      });
      expect(data).deep.equals({
        username_or_email: "foobar",
        password: "password",
      });
    });

    it("should reject invalid username/email", function() {
      [null, 1234, { $ne: "" }, ""].forEach(function(username_or_email) {
        const { error, data } = userLoginParamsValidator.safeParse({
          username_or_email,
          password: "password",
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should reject invalid password", function() {
      [null, 1234, { $ne: "" }, "short", ""].forEach(function(password) {
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

    it("should accept valid input", function() {
      const { data } = userRegistrationParamsValidator.safeParse({
        email: "foo@bar.com",
        password: "long-password",
        username: "foobar",
      });
      expect(data).deep.equals({
        email: "foo@bar.com",
        password: "long-password",
        username: "foobar",
      });
    });

    it("should reject invalid email", function() {
      [null, 1234, { $ne: "" }, "@me", ""].forEach(function(email) {
        const { error, data } = userRegistrationParamsValidator.safeParse({
          email,
          password: "long-password",
          username: "foobar",
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should reject invalid password", function() {
      [null, 1234, { $ne: "" }, "short", ""].forEach(function(password) {
        const { error, data } = userRegistrationParamsValidator.safeParse({
          email: "foo@bar.com",
          password,
          username: "foobar",
        });
        expect(error, JSON.stringify(data)).not.undefined;
      });
    });

    it("should reject invalid username", function() {
      [null, 1234, { $ne: "" }, "2c", ""].forEach(function(username) {
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
        const { data } = validator.safeParse({
          email: "foo@bar.com",
        });
        expect(data).deep.equals({ email: "foo@bar.com" });
      });

      it("should reject invalid email", function() {
        [null, 1234, { $ne: "" }, "@me"].forEach(function(email) {
          const { error, data } = validator.safeParse({
            email,
          });
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
      [null, 1234, { $ne: "" }, "short"].forEach(function(password) {
        const { error, data } = resetPasswordLinkPostParamsValidator.safeParse({
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
