"use strict";

import { mongooseConnection } from "../../../models/MongooseClient";

import { getDummyAccount } from "../../DummyAccountUtils";
import { getRandomCards } from "../../SampleCards";
import { Card, ICard } from "../../../models/mongoose_models/CardSchema";

import * as CardsDB from "../../../models/CardsMongoDB";
import * as LogInUtilities from "../../../models/LogInUtilities";
import * as config from "../../../config";

let dummyUser: LogInUtilities.AuthenticateUser;

describe("Test CardsMongoDB\n", function() {

    // Set the dummy account variable.
    before(function(done) {

        LogInUtilities
            .deleteAllAccounts([config.PUBLIC_USER_USERNAME])
            .then(function (_) { return getDummyAccount(); })
            .then(function(accountInfo) { dummyUser = accountInfo; done(); })
            .catch(function(err) { done(err); });

    });

    after(function() {
        return LogInUtilities.deleteAllAccounts([config.PUBLIC_USER_USERNAME]);
    });

    describe("Method sanity tests...", function() {

        it("should successfully create a card from a payload", function() {
            let card = getRandomCards(1)[0];
            card.createdById = dummyUser.userIDInApp;
            return CardsDB.create(card);
        });

        it("should read all cards belonging to the user", function(done) {
            let cardIDs: Set<string> = new Set([]);

            CardsDB
                .read({userIDInApp: dummyUser.userIDInApp})
                .then(function(cards) {
                    for (let i = 0; i < cards.length; i++) {
                        cardIDs.add(cards[i]._id.toString());
                    }
                    return Card.find({createdById: dummyUser.userIDInApp}).exec();
                })
                .then(function(cards) {
                    for (let i = 0; i < cards.length; i++) {
                        if (!cardIDs.delete(cards[i]._id.toString())) {
                            done(new Error("CardsMongoDB.read() is skipping some cards."));
                            return Promise.reject("BREAK");
                        }
                    }
                    if (cardIDs.size !== 0) {
                        done(new Error(`CardsMongoDB.read() is fetched ${cardIDs.size} extra cards.`));
                    } else {
                        done();
                    }
                })
                .catch(function(err) {
                    if (err !== "BREAK") done(err);
                });

        });

        it("should ignore new cards in the update() method", function(done) {
            let card = getRandomCards(1)[0];
            card.createdById = dummyUser.userIDInApp;
            CardsDB
                .update(card)
                .then(function(updatedCard) {
                    done(updatedCard);
                })
                .catch(function(err) { done(err); });
        });

        it("should only update mutable attributes of existing cards", async function(done) {
            let card = await Card.findOne({userIDInApp: dummyUser.userIDInApp}).exec();
            if (!card) {
                done(new Error("Did not find any cards in the database"));
                return;
            }

            let newUrgency = card.urgency - 2;
            card.urgency = newUrgency;

            card = await CardsDB.update(card);
            if (card.urgency !== newUrgency) {
                done(new Error("The urgency attribute should have been modified, but it wasn't."));
            }

            card.createdById += 1;
            card = await CardsDB.update(card);
            if (card.createdById !== dummyUser.userIDInApp) {
                done(new Error("The createdById attribute should be treated as a constant."));
            }

            done();
        });

    });

});
