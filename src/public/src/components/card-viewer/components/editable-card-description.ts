import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, Ref, ref } from "lit/directives/ref.js";

import { atomOneLight } from "../../syntax-highlighting.styles.js";
import { CardDescription, CardDescriptionType } from "../base-card-viewer.js";
import {
  CardChangedEvent,
  ModifiableCardAttributes,
} from "./card-changed-event.js";

@customElement("cg-editable-card-description")
export class EditableCardDescriptionElement extends LitElement {
  @property({ type: Boolean })
  canEdit = false;
  @property({ type: Object })
  value!: CardDescription;
  @state()
  private showOverlay = false;

  private descriptionRef: Ref<HTMLDivElement> = createRef();

  protected willUpdate(changedProperties: Map<string, any>) {
    if (changedProperties.has("value") || changedProperties.has("canEdit")) {
      this.showOverlay = !this.canEdit && this.value
        && this.value.type === CardDescriptionType.Response;
    }
  }

  render() {
    return html`
      <div id='positioned-lca'>
        <div id='overlay' ?hidden=${!this
      .showOverlay} @click=${this.toggleOverlay}></div>
        <div
            ?contenteditable=${this.canEdit} ${ref(this.descriptionRef)}
            @input=${this.handleDescriptionChange}>
          ${
      this.canEdit
        ? html`<pre id='raw-card-description'>${this.value.raw}</pre>`
        : this.value.markup
    }
        </div>
      </div>
    `;
  }

  private toggleOverlay() {
    this.showOverlay = !this.showOverlay;
  }

  private handleDescriptionChange() {
    const rawTextContent = this.descriptionRef.value!.innerText;
    const changes: ModifiableCardAttributes = {};
    if (this.value.type === CardDescriptionType.Prompt) {
      changes.prompt = rawTextContent;
    }
    if (this.value.type === CardDescriptionType.Response) {
      changes.response = rawTextContent;
    }
    this.dispatchEvent(new CardChangedEvent(changes));
  }

  static styles = [
    css`
      div#positioned-lca {
        position: relative;

        #overlay {
        	position: absolute;
        	width: 100%;
          height: 100%;
          z-index: 10;
          cursor: pointer;
          background-color: var(--main-bg-color);
          border: 1px solid var(--main-border-color);
          border-radius: 4px;

      	  &:hover {
            opacity: 0;
          }
        }

        div[contenteditable] > pre#raw-card-description {
          margin: 0;
          white-space: pre-wrap;
          padding: 6px;
        }
      }
    `,
    atomOneLight,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "cg-editable-card-description": EditableCardDescriptionElement;
  }
}
