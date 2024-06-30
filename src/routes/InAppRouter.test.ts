import { TRPCError } from "@trpc/server";
import { expect } from "chai";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { ZodError } from "zod";

import {
  create as createCard,
  publicSearch,
  search as cardSearch,
} from "../models/CardsMongoDB";
import { AuthenticateUser, authenticateUser } from "../models/LogInUtilities";
import { app } from "../server";
import { dummyAccountDetails } from "../tests/DummyAccountUtils";
import { sampleCards } from "../tests/SampleCards";
import { createCaller } from "./InAppRouter";

const authDetails = {
  username_or_email: dummyAccountDetails.email,
  password: dummyAccountDetails.password,
};

let gUser: AuthenticateUser;
let gCaller: ReturnType<typeof createCaller>;

function passIfValidationError(e: unknown, done: Mocha.Done) {
  if (e instanceof TRPCError && e.cause instanceof ZodError) {
    done();
  } else {
    done(e);
  }
}

/**
 * Convert `payload` into a URL query string of the form expected by tRPC.
 */
function computeTRPCParams(payload: unknown) {
  const encodedPayload = encodeURIComponent(JSON.stringify({ 0: payload }));
  return `batch=1&input=${encodedPayload}`;
}

describe("tRPC helper", () => {
  it("should compute the correct query string", () => {
    const computedParams = computeTRPCParams({
      cardID: "5ad3777e398794001451704a",
    });
    expect(computedParams).to.equal(
      "batch=1&input=%7B%220%22%3A%7B%22cardID%22%3A%225ad3777e398794001451704a%22%7D%7D",
    );
  });
});

async function createPublicAndPrivateCards(user: AuthenticateUser) {
  // Create some public and private cards.
  expect(sampleCards.length).to.be.greaterThanOrEqual(4);
  for (let i = 0; i < 4; ++i) {
    await createCard({
      ...sampleCards[i],
      isPublic: i % 2 === 0,
      createdById: user.userIDInApp,
    });
  }

  // Ensure that there are public cards available.
  const publicCards = await publicSearch({ queryString: "", limit: 5 });
  expect(publicCards.length).to.be.greaterThan(1);
  const samplePublicCardId = publicCards[0]._id.toString();

  // Ensure that there are private cards available.
  const privateCards = await cardSearch(
    { queryString: "", limit: 5 },
    user.userIDInApp,
  );
  expect(privateCards.length).to.be.greaterThan(1);
  const samplePrivateCardId = privateCards[0]._id.toString();

  return {
    samplePublicCardId,
    samplePrivateCardId,
  };
}

describe("/trpc/fetchPublicCard", function() {
  let samplePublicCardId: string;
  let samplePrivateCardId: string;

  this.beforeEach(async () => {
    gUser = await authenticateUser(authDetails);
    gCaller = createCaller({ user: gUser });
    ({ samplePublicCardId, samplePrivateCardId } =
      await createPublicAndPrivateCards(gUser));
    return Promise.resolve();
  });

  function computeRequestURL(payload: unknown) {
    return `/trpc/fetchPublicCard?${computeTRPCParams(payload)}`;
  }

  it("should fetch a public card", async () => {
    const result = await request(app)
      .get(computeRequestURL({ cardID: samplePublicCardId }))
      .expect("Content-Type", /json/)
      .expect(StatusCodes.OK);
    expect(result.body[0].result.data._id).to.equal(samplePublicCardId);
  });

  it("should not fetch a private card", async () => {
    const result = await gCaller.fetchPublicCard({
      cardID: samplePrivateCardId,
    });
    expect(result).to.be.null;
  });

  it("should reject an empty request body", async () => {
    await request(app)
      .get(computeRequestURL({}))
      .expect("Content-Type", /json/)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("should reject a request body without mandatory params", async () => {
    await request(app)
      .get(computeRequestURL({ foo: "bar" }))
      .expect("Content-Type", /json/)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("should be resilient against extra parameters", async () => {
    const result = await request(app)
      .get(computeRequestURL({ cardID: samplePublicCardId, foo: "bar" }))
      .expect("Content-Type", /json/)
      .expect(StatusCodes.OK);
    expect(result.body[0].result.data._id).to.equal(samplePublicCardId);
  });

  it("should use an input parser/validator", async () => {
    await request(app)
      .get(computeRequestURL({ cardID: { $ne: "000000000000000000000000" } }))
      .expect("Content-Type", /json/)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("should return null for a nonexistent card", async () => {
    const result = await gCaller.fetchPublicCard({
      cardID: "000000000000000000000000",
    });
    expect(result).to.be.null;
  });
});

describe("/trpc/searchPublicCards", function() {
  function computeRequestURL(payload: unknown) {
    return `/trpc/searchPublicCards?${computeTRPCParams(payload)}`;
  }

  this.beforeEach(async () => {
    gUser = await authenticateUser(authDetails);
    return await createPublicAndPrivateCards(gUser);
  });

  it("should use an input parser/validator", async () => {
    await request(app)
      .get(computeRequestURL({
        queryString: { $ne: "foobar" },
        limit: 2,
      }))
      .expect("Content-Type", /json/)
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe("/trpc/flagCard", function() {
  this.beforeEach(async () => {
    gUser = await authenticateUser(authDetails);
    return await createPublicAndPrivateCards(gUser);
  });

  it("should use an input parser/validator", async () => {
    await request(app)
      .post("/trpc/flagCard?batch=1")
      .send({ input: { cardID: { $ne: "000000000000000000000000" } } })
      .expect("Content-Type", /json/)
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe("/trpc/fetchCard", function() {
  this.beforeEach(async () => {
    const gUser = await authenticateUser(authDetails);
    gCaller = createCaller({ user: gUser });
    return await createPublicAndPrivateCards(gUser);
  });

  it("should use an input parser/validator", function(done) {
    gCaller.fetchCard({
      cardID: { $ne: "000000000000000000000000" } as unknown as string,
    }).then((card) => {
      done(new Error(`Injection attack succeeded: ${card}`));
    }).catch((e) => {
      passIfValidationError(e, done);
    });
  });
});

describe("/trpc/addCard", function() {
  this.beforeEach(async () => {
    const gUser = await authenticateUser(authDetails);
    gCaller = createCaller({ user: gUser });
    return await createPublicAndPrivateCards(gUser);
  });

  it("should use an input parser/validator", function(done) {
    gCaller.addCard({
      title: "foo; db.collection.drop();",
      description: "bar",
      tags: "baz",
      urgency: 5,
      isPublic: true,
      parent: { $ne: "000000000000000000000000" } as unknown as string,
    }).then((card) => {
      done(new Error(`Injection attack succeeded: ${card}`));
    }).catch((e) => {
      passIfValidationError(e, done);
    });
  });
});

describe("/trpc/updateCard", function() {
  let samplePrivateCardId: string;

  this.beforeEach(async () => {
    const gUser = await authenticateUser(authDetails);
    gCaller = createCaller({ user: gUser });
    ({ samplePrivateCardId } = await createPublicAndPrivateCards(gUser));
    return Promise.resolve();
  });

  it("should use an input parser/validator", function(done) {
    gCaller.updateCard({
      _id: samplePrivateCardId,
      parent: { $ne: "000000000000000000000000" } as unknown as string,
      title: "foo; db.collection.drop();",
    }).then((card) => {
      done(new Error(`Injection attack succeeded: ${card}`));
    }).catch((e) => {
      passIfValidationError(e, done);
    });
  });
});

describe("/trpc/trashCard", function() {
  this.beforeEach(async () => {
    const gUser = await authenticateUser(authDetails);
    gCaller = createCaller({ user: gUser });
    return await createPublicAndPrivateCards(gUser);
  });

  it("should use an input parser/validator", function(done) {
    gCaller.trashCard({
      _id: { $ne: "000000000000000000000000" } as unknown as string,
    }).then((card) => {
      done(new Error(`Injection attack succeeded: ${card}`));
    }).catch((e) => {
      passIfValidationError(e, done);
    });
  });
});

describe("/trpc/deleteCard", function() {
  this.beforeEach(async () => {
    const gUser = await authenticateUser(authDetails);
    gCaller = createCaller({ user: gUser });
    return await createPublicAndPrivateCards(gUser);
  });

  it("should use an input parser/validator", function(done) {
    gCaller.deleteCard({
      _id: { $ne: "000000000000000000000000" } as unknown as string,
    }).then((card) => {
      done(new Error(`Injection attack succeeded: ${card}`));
    }).catch((e) => {
      passIfValidationError(e, done);
    });
  });
});

describe("/trpc/searchCards", function() {
  this.beforeEach(async () => {
    const gUser = await authenticateUser(authDetails);
    gCaller = createCaller({ user: gUser });
    return await createPublicAndPrivateCards(gUser);
  });

  it("should use an input parser/validator", function(done) {
    gCaller.searchCards({
      queryString: { $ne: "foobar" } as unknown as string,
      limit: 2,
    }).then((cards) => {
      done(
        new Error(`Injection attack succeeded: ${cards.length} cards found.`),
      );
    }).catch((e) => {
      passIfValidationError(e, done);
    });
  });
});

describe("/trpc/duplicateCard", function() {
  this.beforeEach(async () => {
    const gUser = await authenticateUser(authDetails);
    gCaller = createCaller({ user: gUser });
    return await createPublicAndPrivateCards(gUser);
  });

  it("should use an input parser/validator", function(done) {
    gCaller.duplicateCard({
      cardID: { $ne: "000000000000000000000000" } as unknown as string,
    }).then((card) => {
      done(
        new Error(`Injection attack succeeded: Duplicated ${card}`),
      );
    }).catch((e) => {
      passIfValidationError(e, done);
    });
  });
});

describe("/trpc/restoreCardFromTrash", function() {
  this.beforeEach(async () => {
    const gUser = await authenticateUser(authDetails);
    gCaller = createCaller({ user: gUser });
    return await createPublicAndPrivateCards(gUser);
  });

  it("should use an input parser/validator", function(done) {
    gCaller.restoreCardFromTrash({
      _id: { $ne: "000000000000000000000000" } as unknown as string,
    }).then((result) => {
      done(
        new Error(`Injection attack succeeded: Restored ${result}`),
      );
    }).catch((e) => {
      passIfValidationError(e, done);
    });
  });
});

describe("/trpc/streak", function() {
  this.beforeEach(async () => {
    const gUser = await authenticateUser(authDetails);
    gCaller = createCaller({ user: gUser });
    return await createPublicAndPrivateCards(gUser);
  });

  it("should use an input parser/validator", function(done) {
    gCaller.streak({
      cardIDs: [{ $ne: "000000000000000000000000" }] as unknown as string[],
    }).then((streak) => {
      done(
        new Error(`Injection attack succeeded: Streak ${streak}`),
      );
    }).catch((e) => {
      passIfValidationError(e, done);
    });
  });
});
