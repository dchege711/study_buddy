import { expect } from "chai";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { ReadPublicCardParams } from "../models/CardsMongoDB";
import { app } from "../server";
import { createCaller } from "./InAppRouter";

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
  const caller = createCaller({ user: null });
  /**
   * Compute the URL for a request to fetch a public card.
   */
  function computeRequestURL(payload: unknown) {
    return `/trpc/fetchPublicCard?${computeTRPCParams(payload)}`;
  }

  it("should avoid an injection attack (supertest)", async () => {
    const response = await request(app)
      .get(computeRequestURL({ cardID: { $ne: "" } }))
      .expect("Content-Type", /json/)
      .expect(StatusCodes.OK);
    expect(response.body).to.deep.equal([{ result: { data: null } }]);
  });

  it("should avoid an injection attack", async () => {
    // Cast because we don't expect adversarial input to be typed.
    const card = await caller.fetchPublicCard(
      { cardID: { $ne: "" } } as unknown as ReadPublicCardParams,
    );
    expect(card).to.be.null;
  });

  it("should test tRPC route", async () => {
    const card = await caller.fetchPublicCard({
      cardID: "5ad3777e398794001451704a",
    });
    expect(card).to.be.null;
  });
});
