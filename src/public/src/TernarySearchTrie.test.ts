import { expect } from "chai";

import { TernarySearchTrie } from "./TernarySearchTrie";

describe("Test TernarySearchTrie\n", function() {

  it("should find words from the initialization set", function() {
    let tst = new TernarySearchTrie(["a", "b", "aa", "c", "da", "Ae", "f"]);

    expect(tst.contains("aa")).to.be.true;
    expect(tst.contains("xyz")).to.be.false;

    let matchingWords = tst.keysWithPrefix("a");
    expect(matchingWords).to.have.members(["a", "aa", "Ae"]);
  });

  it("should find words from a dynamic update", function() {
    let tst = new TernarySearchTrie(["a", "b", "aa", "c", "da", "Ae", "f"]);

    expect(tst.contains("axyz")).to.be.false;

    tst.put("axyz");

    let matchingWords = tst.keysWithPrefix("a");
    expect(matchingWords).to.have.members(["a", "aa", "Ae", "axyz"]);
  });

});
