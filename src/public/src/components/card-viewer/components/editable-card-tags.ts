import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { CardChangedEvent } from '../components/card-changed-event.js';

import '../../tags/card-tag.js';

const kTagRemovedEventName = 'tag-removed';
class TagRemovedEvent extends Event {
    tag: string;
    constructor(tag: string) {
        super(kTagRemovedEventName, { bubbles: true, composed: true });
        this.tag = tag;
    }
}

@customElement('cg-editable-tag')
export class EditableCardTag extends LitElement {
  @property({ type: String}) tag = '';

  render() {
    if (!this.tag) {
      return nothing;
    }

    return html`
      <cg-card-tag .tag=${this.tag}>
        <button @click=${this.removeTag} title='Remove tag'>&#x2716;</button>
      </cg-card-tag>
    `;
  }

  static styles = css`
    button {
      background-color: inherit;
      border: none;
      border-radius: 2px;

      &:hover {
        background-color: red;
      }
    }
  `;

  private removeTag() {
    this.dispatchEvent(new TagRemovedEvent(this.tag));
  }
}

@customElement('cg-editable-card-tags')
export class EditableCardTags extends LitElement {
  @property({type: Object}) tags: Set<string> = new Set();

  constructor() {
    super();
    this.addEventListeners();
  }

  render() {
    return html`
      ${repeat(
        this.tags, (tag) => tag,
        (tag) => html`<cg-editable-tag .tag=${tag}></cg-editable-tag>`
      )}
    `;
  }

  static styles = css`
    :host {
      display: flex;
      gap: 4px;
    }
  `;

  private addEventListeners() {
    this.addEventListener(kTagRemovedEventName, (e: TagRemovedEvent) => {
      e.stopPropagation();

      const newTags = new Set(this.tags);
      newTags.delete(e.tag);
      this.tags = newTags;

      // TODO: Why does this lead to the card not updating visually?
      // this.dispatchEvent(
      //     new CardChangedEvent({ tags: Array.from(this.tags).join(' ')}));
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cg-editable-tag': EditableCardTag;
    'cg-editable-card-tags': EditableCardTags;
  }

  interface GlobalEventHandlersEventMap {
    'tag-removed': TagRemovedEvent;
  }
}
