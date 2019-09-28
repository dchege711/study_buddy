We will use this card to illustrate most of the editing features.

![Raw version of sample card](raw_card.png)

On saving the card, it will be displayed like this:

![How the sample card is rendered with a spoiler box](with_spoiler.png)

The gray box was created by including a `[spoiler]` line anywhere in the card. The gray box will cover anything below the first `[spoiler]` line. To show what's underneath, the gray box, hover over it or click on it:

![The sample card without the spoiler box](pretty_card.png)

## Markdown

Since we're targeting users that store somewhat detailed flashcards, we felt that Markdown (in addition to LaTEX and syntax highlighting) will prove useful. Manually converting markdown to HTML is a project by itself. Since it's not the main purpose of Flashcards by c13u, we were happy to import [Showdown](https://github.com/showdownjs/showdown). The library looks mature and the documentation is sound.

If you're new to Markdown, [here's a handy cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

## Tabbing Inside Card Description

We chose to insert `&nbsp;&nbsp;&nbsp;&nbsp;` if the user pressed the tab key. The downside to this is that deleting a 'tab' requires 4 backspaces. We tried inserting a tab character instead but for it to render, we needed to add `white-space: pre-wrap;` as a style attribute. This however inserts to much whitespace between separate lines of texts. Since flash cards are more frequently read than written, we prioritized having the flash cards as compact as possible in order to avoid the need to scroll down when reading them.

## LaTEX

[MathJAX](https://www.mathjax.org/) renders LaTEX on the app. At first we had problems getting LaTEX to render properly, but we realized that by default, MathJAX expects LaTEX to be already on the DOM. We dug through its documentation and found out that MathJAX allows manual reloads. We therefore added a function that requests MathJAX to re-render the contents of the card template every time the user loads a card.

If you're new to LaTeX, the [LaTeX Wikibook](https://en.wikibooks.org/wiki/LaTeX) and [ShareLaTeX docs](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes) are good tutorials.

## LaTEX Delimiters

Previously, users had to escape the LaTEX delimiter themselves and also escape underscores within inline LaTEX. This meant lines like `\(p_i = 2\)` had to be written as `\\(p\_i = 2\\)`. ~~With some regular expressions, we was able to support the former approach. We traded computational efficiency *(more code to automatically escape backslashes and replace automatically inserted `<em>, </em>` tags)* for convenience *(users entering normal LaTEX)*. We choose to make this correction on the client side since we can't afford that much storage capacity on the server side.~~

We configured `showdown.converter` to escape underscores and asterisks when converting markdown to HTML. Although we had activated these options before, `showdown.converter` wasn't applying them. The bug was fixed on Github. We downloaded the version of `showdown.min.js` available during commit `039dd66256e771716c20a807a2941974ac7c5873`. Since that version works fine, we use my downloaded copy instead of using the version hosted on the CDN since that might change over time. Later versions of the file insert extra whitespace in my code blocks, so we prefer maintaining the version from the above commit.

## Card Urgency

We changed the urgency input from a number input type to a range input type. To set an urgency, using the range input type is faster since the user doesn't really care about the actual value, but its percentage, e.g. *card X is half as important as the most important cards in my deck*. Furthermore, using a range requires one click, while using a number type requires a click and a type.

## Undoing a Card Deletion

We learned that we should [never use a warning when we meant undo](http://alistapart.com/article/neveruseawarning). Seems like a good design decision. Users who really want to delete a card might be unsatisifed, but I bet they're in the minority(?). Furthermore, they can permanently delete a card from the accounts page. Amazing how much fiddling goes in the backend, just to allow a user to delete and then save themselves 3 seconds later by hitting `Undo`.

## Syntax Highlighting

We found the [highlight.js](https://highlightjs.org/) library useful for syntax highlighting. It even allows us to specify what languages we want supported. We downloaded a package from them instead of using a CDN. Although we refrain from adding more dependencies, writing our own syntax highlighter would have been unwise.

## Tag Auto-Completion

The app should help the user use the fewest tags possible while still being descriptive. We address this problem in the following ways:

- Providing autocompletion for tags based on the prefix.
- Suggesting related tags based on previous usage patterns.
