import { expect } from "chai";

import { MaxPriorityQueue } from "./max-priority-queue.js";

describe("Test MaxPriorityQueue\n", function() {
  let testPQ: MaxPriorityQueue<string>;

  beforeEach(function() {
    testPQ = new MaxPriorityQueue<string>();
    testPQ.initialize([
      ["one", 1],
      ["five", 5],
      ["two", 2],
      ["three", 3],
      ["zero", 0],
      ["four", 4],
    ]);
  });

  it("should return items in descending order", function() {
    let expectedOrder = [
      ["five", 5],
      ["four", 4],
      ["three", 3],
      ["two", 2],
      ["one", 1],
      ["zero", 0],
    ];

    expectedOrder.forEach((item) => {
      expect(testPQ.del_max()).deep.equal(item);
    });
  });

  it("should return items in descending order after insertions", function() {
    testPQ.insert(["ten", 10]);
    testPQ.insert(["twenty", 20]);
    testPQ.insert(["-ve one", -1]);

    let expectedOrder = [
      ["twenty", 20],
      ["ten", 10],
      ["five", 5],
      ["four", 4],
      ["three", 3],
      ["two", 2],
      ["one", 1],
      ["zero", 0],
      ["-ve one", -1],
    ];

    expectedOrder.forEach((item) => {
      expect(testPQ.del_max()).deep.equal(item);
    });
  });
});
