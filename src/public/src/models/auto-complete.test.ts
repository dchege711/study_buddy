import { expect } from "chai";

import { AutoComplete } from "./auto-complete.js";

describe("Test AutoComplete\n", function() {
  it("should put more weight on repeated edges", function() {
      let tagGroups = [
          ["a", "b", "c"],
          ["a",      "c", "d"],
          ["a",               "e"],
          [                   "e", "f"],
          [                            "g", "h"]
      ]
      let autoComplete = new AutoComplete();
      autoComplete.initializeGraphFromGroups(tagGroups);

      // "c" is the closest neighbor to "a" because the pairing appears twice.
      let neighbors = autoComplete.kNeighbors(["a"], 1);
      expect(neighbors).deep.equal(["c"]);

      // Closest neighbors are symmetrical.
      neighbors = autoComplete.kNeighbors(["c"], 1);
      expect(neighbors).deep.equal(["a"]);
  });
});
