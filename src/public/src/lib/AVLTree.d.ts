import { Node, AVLTree } from "./AVLTree.js"

declare module "./lib/AVLTree" {
  interface Node {
    left: Node | null;
    right: Node | null;
    parent: Node | null;
    balanceFactor: number;
    key: Key;
    data: Value;
  }
  /**
   * avl v1.4.4
   * Fast AVL tree for Node and browser
   *
   * @author Alexander Milevski <info@w8r.name>
   * @license MIT
   * @preserve true
   */
  class AVLTree<Key, Value> {
    constructor(comparator: (a: Key, b: Key) => bool, noDuplicates: bool);
    destroy(): void;
    clear(): void;
    size: number;
    contains(key: Key): bool;
    next(key: Key): Node | null;
    prev(key: Key): Node | null;
    keys(): Key[];
    values(): Value[];
    at(index: number): Node | null;
    minNode(): Node | null;
    maxNode(): Node | null;
    min(): Key | null;
    max(): Key | null;
    isEmpty(): bool;
    pop(): Node | null;
    popMax(): Node | null;
    find(key: Key): Node | null;
    insert(key: Key, data: Value): Node | null;
    remove(key: Key): Node | null;
    load(keys: Key[], values: Value[], presort: boolean): AVLTree;
    isBalanced(): boolean;
    toString(): string;
  }
}
export { Node, AVLTree };

