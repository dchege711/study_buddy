import { LitElement, html, css, nothing } from 'lit';
import { consume } from '@lit/context';
import { customElement, property, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { CardChangedEvent } from '../components/card-changed-event.js';
import { TextInputEvent, kTextInputEvent, TextInputElement } from '../../input/text-input.js';
import { tagsAutoCompleteContext } from '../../../context/tags-auto-complete-context.js';
import { AutoComplete } from '../../../models/auto-complete.js';

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

@customElement('cg-editable-card-tags')
export class EditableCardTags extends LitElement {
  @property({type: Object}) tags: Set<string> = new Set();
  @query('cg-text-input') private textInput!: TextInputElement;

  @consume({ context: tagsAutoCompleteContext, subscribe: true })
  private tagsAutoComplete?: AutoComplete;

  constructor() {
    super();
    this.addEventListeners();
  }

  render() {
    return html`
      <div id='current-tags-container'>
        ${repeat(
          this.tags, (tag) => tag,
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
            this.suggestedTags, (tag) => tag,
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

    div#current-tags-container {
      flex-wrap: wrap;
    }

    div#input-tags-container {
      span {
        display: flex;
        gap: 2px;
        flex-wrap: wrap;
      }
    }
  `;

  private addEventListeners() {
    this.addEventListener(kTagEditEventName, this.onTagEdited.bind(this));
    this.addEventListener(kTextInputEvent, this.onTagTyped.bind(this));
  }

  private get suggestedTags(): string[] {
    return this.tagsAutoComplete
      ? this.tagsAutoComplete.kNeighbors(Array.from(this.tags), 5)
      : [];
  }

  private onTagEdited(e: TagEditEvent) {
    // Create a new Set instance. A new set is better practice because it
    // ensures that sub-components also get updated.
    //
    // [1]: https://lit.dev/docs/components/properties/#mutating-properties
    const newTags = new Set(this.tags);
    if (e.editType === TagEditType.kAdd) {
      newTags.add(e.tag);
    } else if (e.editType === TagEditType.kRemove) {
      newTags.delete(e.tag);
    }
    this.tags = newTags;

    this.dispatchEvent(
        new CardChangedEvent({ tags: Array.from(newTags).join(' ')}));
  }

  private onTagTyped(e: TextInputEvent) {
    const newTags = new Set(this.tags);
    const tag = e.text;
    newTags.add(tag);
    this.tags = newTags;

    // TODO: Can we avoid the need to do this? Update [1] if you figure it out.
    //
    // [1]: https://www.curiosities.dev/computer-science/programming-challenges/flashcards-app/web-components/of-stale-ui-and-re-renders/#re-renders-on-tagged-templates
    this.textInput.clearText();

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
