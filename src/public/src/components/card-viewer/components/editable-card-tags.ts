import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

interface PendingTags {
  removed: Set<string>;
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
  @state() _pendingTags: PendingTags = { removed: new Set() };

  constructor() {
    super();
    this.addEventListeners();
  }

  render() {
    const tagsToShow = new Set(this.tags);
    this._pendingTags.removed.forEach((tag) => tagsToShow.delete(tag));

    return html`
      ${repeat(
        tagsToShow, (tag) => tag,
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
    this.addEventListener(kTagRemovedEventName, this.onTagRemoved.bind(this));
  }

  private onTagRemoved(e: TagRemovedEvent) {
    // Create a new set of tags that excludes the removed tag. A new set is
    // better practice because it ensures that sub-components also get
    // updated.
    //
    // [1]: https://lit.dev/docs/components/properties/#mutating-properties
    const newTags = new Set(this.tags);
    newTags.delete(e.tag);

    this._pendingTags.removed.add(e.tag);

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
    'tag-removed': TagRemovedEvent;
  }
}
