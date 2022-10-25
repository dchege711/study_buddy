![How the sample card is rendered with a spoiler box](with_spoiler.png)

### The Card Body

* The card's body supports Markdown.
  * If you're new to Markdown, [here's a handy cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
  * models/SanitizationAndValidation.js
* The card's body supports LaTeX.
  * If you're new to LaTeX, the [LaTeX Wikibook](https://en.wikibooks.org/wiki/LaTeX) and [ShareLaTeX docs](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes) are good tutorials.
  * views/partials/syntax_highlighting_and_latex.ejs
* When editing the card's body, pressing `Tab` adds 4 spaces.
  * views/pages/home.ejs
* To cover up part of the body, write `[spoiler]` on one line. Anything below that line will be covered by a gray box.

### Reviewing Cards

* Each card has an associated urgency. Cards with higher urgencies appear first on the deck.
  * At the bottom of the card, there are 4 urgency bars give you an idea of where the urgencies of the selected cards lie.

    ![Screenshot of urgency bars](2019-09-24-urgency-bars.png)

    *For instance, the card above has an urgency of `9`. Of the cards that we can access using the previous and next buttons, this card lies in the top 25% of the urgencies (red bar).*

### Managing Cards

* Deleted a card by mistake? No worries, we provide an opportunity for you to undo that deletion!
  * models/CardsMongoDB.js

### Tagging Cards

* When adding tags, we suggest (possibly) relevant tags, e.g.
    ![Tag AutoCompletion](tags_autocomplete.png)
  * public/src/Autocomplete.js

### Sharing Cards

* To make the card public/private, toggle the switch.
    ![Screenshot of urgency bars](2019-09-24-urgency-bars.png)
  * Private cards are only visible to their owner
  * Public cards are discoverable through the `/browse` page.
  * To set the default privacy setting for new cards:
    * Go to the `/account` page.
    * Check/Uncheck the "If checked, your cards will be private (except the ones that you explicitly set as public)" option

* To share a public card, copy the URL displayed at the top.
    ![Shareable URL](shareable_url.png)
  * Note that the URL works as long as the card still exists and is public.
  * If another user adds your card to your collection, they get a separate copy.
