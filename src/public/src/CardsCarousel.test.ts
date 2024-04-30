import { expect } from 'chai';

import { CardsCarousel } from './CardsCarousel.js';

describe('CardsCarousel', function () {
  it('should handle the empty list', function () {
    const carousel = new CardsCarousel([]);
    expect(carousel.current()).to.be.null;
    expect(carousel.hasNext()).to.be.false;
    expect(carousel.hasPrevious()).to.be.false;
    expect([...carousel]).to.eql([]);
  });

  it('should handle a single card', function () {
    const carousel = new CardsCarousel([{ _id: '1', urgency: 1 }]);
    expect(carousel.current()?._id).to.eql('1');
    expect(carousel.hasNext()).to.be.false;
    expect(carousel.hasPrevious()).to.be.false;
    expect([...carousel].map(card => card._id)).to.eql(['1']);
  });

  it('should handle removing the only card', function () {
    const carousel = new CardsCarousel([{ _id: '1', urgency: 1 }]);
    carousel.removeCard({ _id: '1', urgency: 1 });
    expect(carousel.current()).to.be.null;
    expect(carousel.hasNext()).to.be.false;
    expect(carousel.hasPrevious()).to.be.false;
    expect([...carousel]).to.eql([]);
  });

  it('should start from the highest priority card', function () {
    const carousel = new CardsCarousel([
      { _id: '1', urgency: 1 },
      { _id: '2', urgency: 2 },
      { _id: '3', urgency: 3 },
    ]);

    expect(carousel.current()?._id).to.eql('3');
  });

  it('should be able to iterate over the cards in decreasing priority', function () {
    const carousel = new CardsCarousel([
      { _id: '1', urgency: 1 },
      { _id: '2', urgency: 2 },
      { _id: '3', urgency: 3 },
    ]);

    expect([...carousel].map(card => card._id)).to.eql(['3', '2', '1']);
  });

  it('should cycle through all cards via next/previous', function () {
    const carousel = new CardsCarousel([
      { _id: '1', urgency: 1 },
      { _id: '2', urgency: 2 },
      { _id: '3', urgency: 3 },
    ]);

    const forwardDirectionIds = [];
    while (carousel.hasNext()) {
      forwardDirectionIds.push(carousel.next()!._id);
    }

    expect(forwardDirectionIds).to.eql(['2', '1']);
    expect(carousel.next()).to.be.null;
    expect(carousel.hasNext()).to.be.false;
    expect(carousel.current()?._id).to.eql('1');

    const backwardDirectionIds = [];
    while (carousel.hasPrevious()) {
      backwardDirectionIds.push(carousel.previous()!._id);
    }

    expect(backwardDirectionIds).to.eql(['2', '3']);
    expect(carousel.previous()).to.be.null;
    expect(carousel.hasPrevious()).to.be.false;
    expect(carousel.current()?._id).to.eql('3');
  });

  it('should be able to remove cards', function () {
    const carousel = new CardsCarousel([
      { _id: '1', urgency: 1 },
      { _id: '2', urgency: 2 },
      { _id: '3', urgency: 3 },
    ]);

    carousel.removeCard({ _id: '2', urgency: 2 });
    expect([...carousel].map(card => card._id)).to.eql(['3', '1']);
  });

  it('should move to the next card after removing the current card', function () {
    const carousel = new CardsCarousel([
      { _id: '1', urgency: 1 },
      { _id: '2', urgency: 2 },
      { _id: '3', urgency: 3 },
    ]);

    expect(carousel.current()?._id).to.eql('3');

    carousel.removeCard(carousel.current()!);
    expect(carousel.current()?._id).to.eql('2');
    expect([...carousel].map(card => card._id)).to.eql(['2', '1']);

    carousel.removeCard(carousel.current()!);
    expect(carousel.current()?._id).to.eql('1');

    carousel.removeCard(carousel.current()!);
    expect(carousel.current()).to.be.null;
  });

  it('should move to the previous card if removing the last card', function() {
    const carousel = new CardsCarousel([
      { _id: '1', urgency: 1 },
      { _id: '2', urgency: 2 },
      { _id: '3', urgency: 3 },
    ]);

    while (carousel.hasNext()) {
      carousel.next();
    }

    let currentCard = carousel.current();
    expect(currentCard?._id).to.eql('1');

    carousel.removeCard(currentCard!);
    expect(carousel.current()?._id).to.eql('2');
  });

  it('should handle setting current() to a specific card', function () {
    const carousel = new CardsCarousel([
      { _id: '1', urgency: 1 },
      { _id: '2', urgency: 2 },
      { _id: '3', urgency: 3 },
    ]);

    expect(carousel.current()?._id).to.not.eql('2');
    let success = carousel.setCurrentCard({ _id: '2', urgency: 2 });
    expect(success).to.be.true;
    expect(carousel.current()?._id).to.eql('2');
  });

  it('should no-op if setting current() to a non-existent card', function () {
    const carousel = new CardsCarousel([
      { _id: '1', urgency: 1 },
      { _id: '2', urgency: 2 },
      { _id: '3', urgency: 3 },
    ]);

    let currentId = carousel.current()!._id;
    expect(currentId).to.eql('3');

    let success = carousel.setCurrentCard({ _id: '4', urgency: 4 });
    expect(success).to.be.false;
    expect(carousel.current()?._id).to.eql(currentId);
  });
});
