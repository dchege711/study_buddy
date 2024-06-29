import { expect } from "chai";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { create as createCard, publicSearch } from "../models/CardsMongoDB";
import { authenticateUser } from "../models/LogInUtilities";
import { app } from "../server";
import { dummyAccountDetails } from "../tests/DummyAccountUtils";
import { sampleCards } from "../tests/SampleCards";
import { createCaller } from "./InAppRouter";

const authDetails = {
  username_or_email: dummyAccountDetails.email,
  password: dummyAccountDetails.password,
};

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

describe.only("fetchPublicCard", function() {
  let caller: ReturnType<typeof createCaller>;
  let samplePublicCardId: string;

  this.beforeEach(async () => {
    const user = await authenticateUser(authDetails);
    caller = createCaller({ user });

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
    samplePublicCardId = publicCards[0]._id.toString();

    return Promise.resolve();
  });

  /**
   * Compute the URL for a request to fetch a public card.
   */
  function computeRequestURL(payload: unknown) {
    return `/trpc/fetchPublicCard?${computeTRPCParams(payload)}`;
  }

  it("should avoid an injection attack", async () => {
    await request(app)
      .get(computeRequestURL({ cardID: { $ne: "000000000000000000000000" } }))
      .expect("Content-Type", /json/)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("should fetch an available public card", async () => {
    const card = await caller.fetchPublicCard({
      cardID: samplePublicCardId,
    });
    expect(card?._id.toString()).to.equal(samplePublicCardId);
  });
});
