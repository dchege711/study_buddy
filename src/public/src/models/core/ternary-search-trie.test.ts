import { expect } from "chai";

import { TernarySearchTrie } from "./ternary-search-trie.js";

describe("Test TernarySearchTrie\n", function() {
  it("should find words from the initialization set", function() {
    const tst = new TernarySearchTrie(["a", "b", "aa", "c", "da", "Ae", "f"]);

    expect(tst.contains("aa")).to.be.true;
    expect(tst.contains("xyz")).to.be.false;

    const matchingWords = tst.keysWithPrefix("a");
    expect(matchingWords).to.have.members(["a", "aa"]);
  });

  it("should find words from a dynamic update", function() {
    const tst = new TernarySearchTrie(["a", "b", "aa", "c", "da", "Ae", "f"]);

    expect(tst.contains("axyz")).to.be.false;

    tst.put("axyz");

    const matchingWords = tst.keysWithPrefix("a");
    expect(matchingWords).to.have.members(["a", "aa", "axyz"]);
  });
});
