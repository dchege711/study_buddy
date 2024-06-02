import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

export enum InputState {
  PressedSpace = 1,
  PressedEnter = 2,
  InWord = 3,
}

export const kTextInputEvent = 'text-input';
export class TextInputEvent extends Event {
  /**
   * The text content as was inputted by the user. Guaranteed to be non-empty.
   */
  text: string;

  state: InputState;

  constructor(text: string, state: InputState) {
    super(kTextInputEvent, { bubbles: true, composed: true });
    this.text = text;
    this.state = state;
  }
}

export const kTextInputBlurEvent = 'text-input-blur';
export class TextInputBlurEvent extends Event {
  constructor() {
    super(kTextInputBlurEvent, { bubbles: true, composed: true });
  }
}

@customElement('cg-text-input')
export class TextInputElement extends LitElement {
  @property({ type: String }) placeholder = '';

  private inputState = InputState.InWord;

  inputRef: Ref<HTMLInputElement> = createRef();

  render() {
    return html`
      <input
          placeholder=${this.placeholder}
          @keydown=${this.onKeyDown}
          @blur=${this.onBlur}
          ${ref(this.inputRef)} >
    `;
  }

  static styles = css`
    :host {
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    input {
      border: none;
      border-bottom: 0.2px solid black;
      padding: 1%;
    }
  `;

  private onKeyDown(e: KeyboardEvent) {
    this.inputState = this.getInputState(e.key);
    if (this.inputState === InputState.InWord) {
      return;
    }

    const text = this.inputRef.value?.value.trim() || '';
    if (text.length === 0) {
      return;
    }

    this.dispatchEvent(new TextInputEvent(text, this.inputState));
  }

  private onBlur() {
    this.dispatchEvent(new TextInputBlurEvent());
  }

  private getInputState(keyPress: string): InputState {
    switch(keyPress) {
      case ' ':
        return InputState.PressedSpace;
      case 'Enter':
        return InputState.PressedEnter;
      default:
        return InputState.InWord;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cg-text-input': TextInputElement;
  }

  interface GlobalEventHandlersEventMap {
    'text-input': TextInputEvent;
  }
}
