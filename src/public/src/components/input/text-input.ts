import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

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

  @query('input') private input!: HTMLInputElement;

  /**
   * Clear the current text input.
   */
  clearText() {
    this.input.value = '';
  }

  render() {
    return html`
      <input
          .placeholder=${this.placeholder}
          .value=${''}
          @keyup=${this.onKeyUp}
          @blur=${this.onBlur} >
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

  private onKeyUp(e: KeyboardEvent) {
    this.inputState = this.getInputState(e.key);

    const text = this.input.value.trim() || '';
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
