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

  it("should provide case insensitive prefix matching", function() {
    const autoComplete = new AutoComplete();
    autoComplete.initializePrefixTree(["Programming", "programming", "Algorithms", "algorithms", "JavaScript", "javascript", "React", "react"]);

    // Lowercase prefix should find both Programming and programming
    const progMatches = autoComplete.keysWithPrefix("prog");
    expect(progMatches).to.include.members(["Programming", "programming"]);

    // Uppercase prefix should also find both
    const ProgMatches = autoComplete.keysWithPrefix("Prog");
    expect(ProgMatches).to.include.members(["Programming", "programming"]);

    // Mixed case prefix should work too
    const algMatches = autoComplete.keysWithPrefix("alg");
    expect(algMatches).to.include.members(["Algorithms", "algorithms"]);

    const AlgMatches = autoComplete.keysWithPrefix("Alg");
    expect(AlgMatches).to.include.members(["Algorithms", "algorithms"]);

    // Test JavaScript variations
    const jsMatches = autoComplete.keysWithPrefix("java");
    expect(jsMatches).to.include.members(["JavaScript", "javascript"]);

    const JSMatches = autoComplete.keysWithPrefix("Java");
    expect(JSMatches).to.include.members(["JavaScript", "javascript"]);

    // Test React variations
    const reactMatches = autoComplete.keysWithPrefix("react");
    expect(reactMatches).to.include.members(["React", "react"]);

    const ReactMatches = autoComplete.keysWithPrefix("React");
    expect(ReactMatches).to.include.members(["React", "react"]);
  });

  it("should not return duplicates", function() {
    const autoComplete = new AutoComplete();
    autoComplete.initializePrefixTree(["test", "Test", "TEST"]);

    const matches = autoComplete.keysWithPrefix("test");
    // Convert to Set to check for duplicates
    expect(matches.length).to.equal(new Set(matches).size);
    expect(matches).to.include.members(["test", "Test", "TEST"]);
  });
});
