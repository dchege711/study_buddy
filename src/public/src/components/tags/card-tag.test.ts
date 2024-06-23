import { expect, fixture, html } from "@open-wc/testing";

import "./card-tag.js";

describe("card-tag", () => {
  it("should display the tag with prefix", async () => {
    const tag = await fixture(html`<cg-card-tag .tag=${"test"}></cg-card-tag>`);
    expect(tag.shadowRoot?.textContent?.trim()).to.equal("#test");
  });
});
