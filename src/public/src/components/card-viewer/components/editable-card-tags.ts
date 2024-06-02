import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { CardChangedEvent } from '../components/card-changed-event.js';
import { TextInputEvent, kTextInputEvent } from '../../input/text-input.js';

import '../../tags/card-tag.js';
import '../../input/text-input.js';

enum TagEditType {
  kAdd, kRemove
}

const kTagEditEventName = 'tag-edit';
class TagEditEvent extends Event {
    tag: string;
    editType: TagEditType;

    constructor(tag: string, type: TagEditType) {
        super(kTagEditEventName, { bubbles: true, composed: true });
        this.tag = tag;
        this.editType = type;
    }
}

@customElement('cg-editable-tag')
export class EditableCardTag extends LitElement {
  @property({ type: String}) tag = '';
  @property({ attribute: false }) type = TagEditType.kAdd;

  render() {
    if (!this.tag) {
      return nothing;
    }

    const buttonTitle = this.type === TagEditType.kAdd ? 'Add tag' : 'Remove tag';
    const buttonText = this.type === TagEditType.kAdd ? html`&#x2795;` : html`&#x2716;`;

    return html`
      <cg-card-tag .tag=${this.tag}>
        <button @click=${this.editTag} title=${buttonTitle}>
          ${buttonText}
        </button>
      </cg-card-tag>
    `;
  }

  static styles = css`
    button {
      background-color: inherit;
      border: none;
      border-radius: 2px;

      &:hover[title='Remove tag'] {
        background-color: red;
      }

      &:hover[title='Add tag'] {
        background-color: green;
      }
    }
  `;

  private editTag() {
    this.dispatchEvent(new TagEditEvent(this.tag, this.type));
  }
}

interface PendingTags {
  removed: Set<string>;
  added: Set<string>;
}

@customElement('cg-editable-card-tags')
export class EditableCardTags extends LitElement {
  @property({type: Object}) tags: Set<string> = new Set();

  /**
   * Dispatching `CardChangedEvent` bubbles up to `EditableCardViewer` which
   * updates its inner state. Even though that state is not used in a template,
   * it still triggers a re-render, which sets `this.tags`. To show an updated
   * UI to the user, we need to keep track of the tags that are pending so that
   * we can exclude/show them until the parent component saves the changes and
   * updates `this.tags`.
   */
  @state() _pendingTags: PendingTags = {
    removed: new Set(),
    added: new Set(),
  };

  constructor() {
    super();
    this.addEventListeners();
  }

  render() {
    const tagsToShow = new Set(this.tags);
    this._pendingTags.removed.forEach((tag) => tagsToShow.delete(tag));
    this._pendingTags.added.forEach((tag) => tagsToShow.add(tag));

    const suggestedTags = new Set([
      'suggested', 'tags', 'here', 'for', 'you', 'to', 'use'
    ]);

    return html`
      <div id='current-tags-container'>
        ${repeat(
          tagsToShow, (tag) => tag,
          (tag) => html`
            <cg-editable-tag .tag=${tag} .type=${TagEditType.kRemove}>
            </cg-editable-tag>
          `
        )}
      </div>
      <div id='input-tags-container'>
        <cg-text-input placeholder='Add tag'></cg-text-input>
        <span>
          ${repeat(
            suggestedTags, (tag) => tag,
            (tag) => html`
              <cg-editable-tag .tag=${tag} .type=${TagEditType.kAdd}>
              </cg-editable-tag>
            `
          )}
        </span>
      </div>
    `;
  }

  static styles = css`
    :host, div#current-tags-container, div#input-tags-container {
      display: flex;
      gap: 4px;
    }

    :host {
      flex-direction: column;
    }

    div#input-tags-container {
      cg-text-input {
        flex-grow: 1;
      }

      span {
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
      }
    }
  `;

  private addEventListeners() {
    this.addEventListener(kTagEditEventName, this.onTagEdited.bind(this));
    this.addEventListener(kTextInputEvent, this.onTagTyped.bind(this));
  }

  private onTagEdited(e: TagEditEvent) {
    // Create a new Set instance. A new set is better practice because it
    // ensures that sub-components also get updated.
    //
    // [1]: https://lit.dev/docs/components/properties/#mutating-properties
    const newTags = new Set(this.tags);
    if (e.editType === TagEditType.kAdd) {
      newTags.add(e.tag);
      this._pendingTags.added.add(e.tag);
    } else if (e.editType === TagEditType.kRemove) {
      newTags.delete(e.tag);
      this._pendingTags.removed.add(e.tag);
    }

    this.dispatchEvent(
        new CardChangedEvent({ tags: Array.from(newTags).join(' ')}));
  }

  private onTagTyped(e: TextInputEvent) {
    const newTags = new Set(this.tags);
    const tag = e.text;
    newTags.add(tag);
    this._pendingTags.added.add(tag);

    this.dispatchEvent(
        new CardChangedEvent({ tags: Array.from(newTags).join(' ')}));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cg-editable-tag': EditableCardTag;
    'cg-editable-card-tags': EditableCardTags;
  }

  interface GlobalEventHandlersEventMap {
    'tag-edit': TagEditEvent;
  }
}