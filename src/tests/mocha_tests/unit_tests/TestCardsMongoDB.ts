"use strict";

import { expect } from "chai";

import { Card, ICard } from "../../../models/mongoose_models/CardSchema";
import { getDummyAccount } from "../../DummyAccountUtils";
import { getRandomCards } from "../../SampleCards";

import * as config from "../../../config";
import * as CardsDB from "../../../models/CardsMongoDB";
import * as LogInUtilities from "../../../models/LogInUtilities";

let dummyUser: LogInUtilities.AuthenticateUser;

describe("Test CardsMongoDB\n", function() {
  // Set the dummy account variable.
  beforeEach(function(done) {
    LogInUtilities
      .deleteAllAccounts([config.PUBLIC_USER_USERNAME])
      .then(function() {
        return getDummyAccount();
      })
      .then(function(accountInfo) {
        dummyUser = accountInfo;
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  afterEach(function() {
    return LogInUtilities.deleteAllAccounts([config.PUBLIC_USER_USERNAME]);
  });

  it("should successfully create a card from a payload", function() {
    const card = getRandomCards(1, dummyUser.userIDInApp)[0];
    card.createdById = dummyUser.userIDInApp;
    return CardsDB.create(card);
  });

  it("should read all cards belonging to the user", function(done) {
    const cardIDs: Set<string> = new Set([]);

    CardsDB
      .search({ queryString: "", limit: Infinity }, dummyUser.userIDInApp)
      .then(function(cards) {
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i] as ICard;
          cardIDs.add(card._id.toString());
        }
        return Card.find({ createdById: dummyUser.userIDInApp }).exec();
      })
      .then(function(cards) {
        for (let i = 0; i < cards.length; i++) {
          if (!cardIDs.delete(cards[i]._id.toString())) {
            done(new Error("CardsMongoDB.read() is skipping some cards."));
            return Promise.reject("BREAK");
          }
        }
        if (cardIDs.size !== 0) {
          done(
            new Error(
              `CardsMongoDB.read() is fetched ${cardIDs.size} extra cards.`,
            ),
          );
        } else {
          done();
        }
      })
      .catch(function(err) {
        if (err !== "BREAK") { done(err); }
      });
  });

  it("should ignore new cards in the update() method", function(done) {
    const card = getRandomCards(1, dummyUser.userIDInApp)[0];
    card.createdById = dummyUser.userIDInApp;
    CardsDB
      .update(card)
      .then(function(updatedCard) {
        done(updatedCard);
      })
      .catch(function() {
        done();
      });
  });

  it("should only update mutable attributes of existing cards", async function() {
    let card = await CardsDB.create({
      title: "A",
      description: "B",
      createdById: dummyUser.userIDInApp,
      urgency: 7,
      isPublic: true,
      parent: "",
      tags: "update mutable",
    });
    card.urgency = 9;

    card = await CardsDB.update(card);
    expect(card.urgency, "Urgency should change").equals(9);

    card.createdById += 1;
    card = await CardsDB.update(card);
    expect(card.createdById, "Creator ID should not change")
      .equals(dummyUser.userIDInApp);
  });

  it("should provide correct tag groupings", async function() {
    const userIDInApp = dummyUser.userIDInApp;
    const sampleCards: CardsDB.CreateCardParams[] = [
      {
        title: "A",
        description: "B",
        createdById: userIDInApp,
        urgency: 1,
        isPublic: true,
        parent: "",
        tags: "a b",
      },
      {
        title: "A",
        description: "B",
        createdById: userIDInApp,
        urgency: 1,
        isPublic: true,
        parent: "",
        tags: "c d",
      },
      {
        title: "A",
        description: "B",
        createdById: userIDInApp,
        urgency: 1,
        isPublic: true,
        parent: "",
        tags: "a d",
      },
      {
        title: "A",
        description: "B",
        createdById: userIDInApp,
        urgency: 1,
        isPublic: true,
        parent: "",
        tags: "x",
      },
      {
        title: "A",
        description: "B",
        createdById: userIDInApp,
        urgency: 1,
        isPublic: true,
        parent: "",
        tags: "y",
      },
    ];
    await CardsDB.createMany(sampleCards);

    const tagGroups = await CardsDB.getTagGroupings({ userIDInApp });
    tagGroups.sort();

    const expectedTagGroups: string[][] = [];
    for (const card of sampleCards) {
      expectedTagGroups.push(card.tags.split(" "));
      expectedTagGroups.push(["sample_card"]);
    }
    expectedTagGroups.sort();

    expect(tagGroups).deep.equal(expectedTagGroups);
  });
});
