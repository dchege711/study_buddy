import { expect } from "@open-wc/testing";

import { AutoComplete } from "./auto-complete.js";

describe("Test AutoComplete\n", function() {
  it("should put more weight on repeated edges", function() {
    const tagGroups = [
      ["a", "b", "c"],
      ["a", "c", "d"],
      ["a", "e"],
      ["e", "f"],
      ["g", "h"],
    ];
    const autoComplete = new AutoComplete();
    autoComplete.initializeGraphFromGroups(tagGroups);

    // "c" is the closest neighbor to "a" because the pairing appears twice.
    let neighbors = autoComplete.kNeighbors(["a"], 1);
    expect(neighbors).deep.equal(["c"]);

    // Closest neighbors are symmetrical.
    neighbors = autoComplete.kNeighbors(["c"], 1);
    expect(neighbors).deep.equal(["a"]);
  });
});
