import AVLTree, { Node } from "avl";

import { CardSearchResult } from "../trpc.js";

export type CardsCarouselBSTKey = Required<
  Pick<CardSearchResult, "_id" | "urgency">
>;
type CardsCarouselBSTValue = null;

type CardsCarouselBSTNode = Node<CardsCarouselBSTKey, CardsCarouselBSTValue>;

/**
 * Manage the set of cards being displayed to the user.
 *
 * @class
 */
export class CardsCarousel implements Iterable<CardsCarouselBSTKey> {
  private bst: AVLTree.default<CardsCarouselBSTKey, CardsCarouselBSTValue>;
  private currentNode: CardsCarouselBSTNode | null = null;

  constructor(minicards: CardsCarouselBSTKey[]) {
    this.bst = new AVLTree.default<CardsCarouselBSTKey, CardsCarouselBSTValue>(
      this.reverseComparator,
    );
    for (const card of minicards) {
      if (!card._id || !card.urgency) {
        throw new Error("Card missing _id or urgency");
      }

      this.insertCard(card);
    }
    this.currentNode = this.bst.minNode();
  }

  /**
   * A function for comparing the keys for the BST
   *
   * @param {Object} a Expected attributes: `urgency`, `_id`
   * @param {Object} b Expected attributes: `urgency`, `id`
   *
   * @returns {Number} `0` if the keys are equal, `1` if `a < b` and `-1` if
   * `a > b`
   */
  reverseComparator(a: CardsCarouselBSTKey, b: CardsCarouselBSTKey): number {
    if (a.urgency < b.urgency) { return 1; }
    if (a.urgency > b.urgency) { return -1; }
    if (a._id < b._id) { return 1; }
    if (a._id > b._id) { return -1; }
    return 0;
  }

  /**
   * @description An iterator over all cards that are discoverable through
   * the `prev()` and `next()` methods of the `CardsCarousel`
   */
  [Symbol.iterator]() {
    const bst = this.bst;
    let node: CardsCarouselBSTNode | null = bst.minNode();

    return {
      next(): IteratorResult<CardsCarouselBSTKey> {
        if (node && node.key) {
          const value = node.key;
          node = bst.next(node);
          return {
            done: false,
            value: value,
          };
        } else {
          return {
            done: true,
            value: null,
          };
        }
      },
    };
  }

  /**
   * @description Return the next card on the queue.
   * @param {Function} callback The function to call that accepts a card
   * as a parameter.
   */
  next(): CardsCarouselBSTKey | null {
    if (!this.hasNext()) {
      return null;
    }

    if (this.currentNode === null) {
      const min = this.bst.min();
      if (min === null) {
        throw new Error("No cards left, but hasNext() claims there are some");
      }
      this.currentNode = this.bst.find(min);
    } else {
      this.currentNode = this.bst.next(this.currentNode);
    }

    if (this.currentNode === null || !this.currentNode.key) {
      throw new Error("No cards left, but hasNext() claims there are some");
    }

    return this.currentNode.key;
  }

  /**
   * @return {Boolean} `true` if calling `next()` will produce a card. `false`
   * otherwise
   */
  hasNext(): boolean {
    if (this.bst.size === 0) { return false; }
    if (this.currentNode === null) { return true; }
    return this.bst.next(this.currentNode) !== null;
  }

  current(): CardsCarouselBSTKey | null {
    if (this.currentNode === null || this.currentNode.key === undefined) {
      return null;
    }
    return this.currentNode.key;
  }

  /**
   * @return {Boolean} `true` if calling `prev()` will produce a card. `false`
   * otherwise
   */
  hasPrevious(): boolean {
    if (this.bst.size === 0) { return false; }
    if (this.currentNode === null) { return true; }
    return this.bst.prev(this.currentNode) !== null;
  }

  /**
   * @description Return the previous card on the queue.
   * @param {Function} callback The function to call that accepts a card
   * as a parameter.
   */
  previous(): CardsCarouselBSTKey | null {
    if (!this.hasPrevious() || this.currentNode === null) {
      return null;
    }

    this.currentNode = this.bst.prev(this.currentNode);
    if (this.currentNode === null || !this.currentNode.key) {
      throw new Error("No cards left, but hasPrevious() claims there are some");
    }

    return this.currentNode.key;
  }

  /**
   * @description Remove the specified card from the cards that are displayed
   * to the user.
   *
   * @param {String} idOfCardToRemove The ID of the card to be removed from
   * the queue of cards.
   */
  removeCard(key: CardsCarouselBSTKey) {
    this.bst.remove(key);
    // If we're removing the current card, adjust such that `next()`
    // resolves to the card that followed the card that we'll remove
    if (
      this.currentNode && this.currentNode.key
      && this.currentNode.key._id === key._id
    ) {
      if (this.hasPrevious()) {
        this.currentNode = this.bst.prev(this.currentNode);
      } else if (this.hasNext()) {
        this.currentNode = this.bst.next(this.currentNode);
      } else {
        this.currentNode = null;
      }
    }
  }

  setCurrentCard(key: CardsCarouselBSTKey): boolean {
    const node = this.bst.find(key);
    if (node === null) {
      return false;
    }
    this.currentNode = node;
    return true;
  }

  /**
   * @description Insert a card into the set of cards that can be discovered
   * by the `next()` and `prev()` iterators. The card will be insrted into
   * its natural position in the iteration order. As such, it may not be
   * the card returned by the immediate call of either `prev()` or `next()`
   *
   * @param {String} newCardID The ID of the card to insert into the queue
   * @param {Number} newCardUrgency The urgency of the card to be inserted.
   * Used as a sorting key.
   */
  insertCard(key: CardsCarouselBSTKey) {
    this.bst.insert(key);
  }

  /**
   * @description Sync the changes made to the card with the card manager. We
   * don't check whether the urgency changed. The old key is removed from the
   * BST and a new (possibly updated) key is added to the BST.
   *
   * @param {Object} card the new version of the card
   */
  updateCard(key: CardsCarouselBSTKey) {
    this.removeCard(key);
    this.insertCard(key);
  }

  /**
   * @description Compute and return the 0th, 1st, 2nd, 3rd and 4th quartiles
   * of the urgencies of the cards on the current `CardsCarousel` object.
   *
   * @returns {Array} A 5 element array denoting the 0th, 1st, 2nd, 3rd and 4th
   * quartiles of the urgences.
   */
  quartiles() {
    const N = this.bst.size;
    if (N == 0) {
      return [0, 0, 0, 0, 0];
    } else if (N <= 4) {
      // Recall that the BST is populated using `reverseComparator()`, thus
      // the min node on the BST has the highest urgency.
      const maxUrgency = this.bst.min()?.urgency || -Infinity;
      return [maxUrgency, maxUrgency, maxUrgency, maxUrgency, maxUrgency];
    } else {
      const zeroQuartile = this.bst.max();
      const firstQuartile = this.bst.at(Math.floor(3 * N / 4));
      const secondQuartile = this.bst.at(Math.floor(N / 2));
      const thirdQuartile = this.bst.at(Math.floor(N / 4));
      const fourthQuartile = this.bst.min();
      if (
        zeroQuartile === null || firstQuartile === null
        || secondQuartile === null || thirdQuartile === null
        || fourthQuartile === null
      ) {
        throw new Error("Unexpected null value in quartiles()");
      }
      if (
        firstQuartile.key === undefined || secondQuartile.key === undefined
        || thirdQuartile.key === undefined
      ) {
        throw new Error("Unexpected null keys in quartiles()");
      }
      return [
        zeroQuartile.urgency,
        firstQuartile.key.urgency,
        secondQuartile.key.urgency,
        thirdQuartile.key.urgency,
        fourthQuartile.urgency,
      ];
    }
  }

  get state() {
    const current = this.currentNode;
    const next = current ? this.bst.next(current) : null;
    const previous = current ? this.bst.prev(current) : null;
    return {
      current: current?.key || null,
      next: next?.key || null,
      previous: previous?.key || null,
      hasNext: this.hasNext(),
      hasPrevious: this.hasPrevious(),
      size: this.bst.size,
    };
  }
}
