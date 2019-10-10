We will use this card to illustrate most of the editing features.

![Raw version of sample card](raw_card.png)

On saving the card, it will be displayed like this:

![How the sample card is rendered with a spoiler box](with_spoiler.png)

The gray box was created by including a `[spoiler]` line anywhere in the card. The gray box will cover anything below the first `[spoiler]` line. To show what's underneath, the gray box, hover over it or click on it:

![The sample card without the spoiler box](pretty_card.png)

## Features of the Card Editor

* The card's body supports Markdown.
  * If you're new to Markdown, [here's a handy cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet). 
  * models/SanitizationAndValidation.js
* The card's body supports LaTeX.
  * If you're new to LaTeX, the [LaTeX Wikibook](https://en.wikibooks.org/wiki/LaTeX) and [ShareLaTeX docs](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes) are good tutorials.
  * views/partials/syntax_highlighting_and_latex.ejs
* When editing the card's body, pressing `Tab` adds 4 spaces.
  * views/pages/home.ejs
* Deleted a card by mistake? No worries, we provide an opportunity for you to undo that deletion!
  * models/CardsMongoDB.js
* When adding tags, we suggest (possibly) relevant tags.
  * public/src/Autocomplete.js
* To make the card public/private, toggle the switch.
  * Private cards are only visible to their owner
  * Public cards are discoverable through the `/browse` page.
  * To set the default privacy setting for new cards:
    * Go to the `/account` page.
    * Check/Uncheck the "If checked, your cards will be private (except the ones that you explicitly set as public)" option
* To share a public card, copy the URL displayed at the top.
  * Note that the URL works as long as the card still exists and is public.
  * If another user adds your card to your collection, they get a separate copy.
