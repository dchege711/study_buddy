import { expect } from "chai";

import { ReadPublicCardParams } from "../models/CardsMongoDB";
import { createCaller } from "./InAppRouter";

describe.only("fetchPublicCard", function() {
  const caller = createCaller({ user: null });

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
