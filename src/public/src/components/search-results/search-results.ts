import { LitElement, css, html } from 'lit';
import { customElement, property } from "lit/decorators.js";

import { CardSearchResult } from '../../trpc.js';

@customElement('search-result-tag')
export class SearchResultTag extends LitElement {
  @property({ type: String }) tag!: string;

  render() {
    return html`
      <span>#${this.tag}</span>
    `;
  }

  static styles = css`
    span {
      background-color: var(--main-bg-color);
      border-radius: 4px;
      border: 1px solid var(--main-border-color);
      padding: 2px;
    }
  `;
}

function variableLengthTags() {
  let numTags = Math.floor(Math.random() * 10);
  let tags = ['dynamic_programming', 'greedy', 'graph_theory'];

  let result: string[] = [];
  for (let i = 0; i < numTags; i++) {
    result.push(tags[Math.floor(Math.random() * tags.length)]);
  }
  return result.join(' ');
}

@customElement('search-result')
export class SearchResult extends LitElement {
  @property({ type: Object }) result!: CardSearchResult;

  render() {
    return html`
      <article>
        <p><em>${this.result.title}</em></p>
        <p class='tags-holder'>
          ${this.result.tags?.split(' ').filter(Boolean).map(
            (tag) => html`
              <search-result-tag .tag=${tag}></search-result-tag>
            `
          )}
        </p>
      </article>
    `;
  }

  static styles = css`
    :host {
      border-radius: 6px;
      background-color: var(--card-bg-color);
      box-shadow: 0 4px 10px 0 var(--box-shadow-color);
      flex: 200px;
      padding: 4px;
    }

    p.tags-holder {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 5px;
    }
  `;
}

@customElement('search-results')
export class SearchResults extends LitElement {
  private searchResults: CardSearchResult[] = Array.from(Array(25).keys()).map(
    (i) => ({
      _id: i.toString(),
      title: `What is contained in card number ${i}? We won't know until we click on it.`,
      tags: variableLengthTags(),
      urgency: i % 3
    })
  );

  render() {
    return html`
      ${this.searchResults.map(
          (result) => html`
            <search-result .result=${result}></search-result>`
        )}
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
    }
  `;
}
