# Study Buddy by c13u

The web app is live at [https://notes.c13u.com/](https://notes.c13u.com/)

## [Tasks](#tasks)

:white_check_mark: [Add an Accounts Page](#add-an-accounts-page)

:white_check_mark: [Implement a Card Review System](#implement-a-card-review-system)

:white_check_mark: [Enhance the Tagging System](#enhance-the-tagging-system)

:white_check_mark: [Support Text Search for Cards](#support-text-search-for-cards)

:white_check_mark: [Persistent Session Management](#persistent-session-management)

:white_check_mark: [Login, SignUp and Account Recovery](#login-signup-and-account-recovery)

:white_check_mark: [Make card navigation through the GUI more user-friendly](#make-card-navigation-more-user-friendly)

:white_check_mark: [Make editing of cards more user-friendly](#make-editing-of-cards-more-user-friendly)

:white_check_mark: [Support moving a card to the trash and undoing the move](#support-deleting-a-card-moving-a-card-to-the-trash-and-undoing-the-move)

:white_check_mark: [Organize how data will be represented in the database](#organize-how-data-will-be-represented-in-the-database)

:white_check_mark: [Render card content appropriately](#render-card-content-appropriately)

:white_check_mark: [Add a sidebar that supports filters based on tags](#add-a-sidebar-that-supports-filters-based-on-tags)

### To-do Items

:soon: Submit the web app to various forums. :sweat_smile:

:soon: Learn how to handle subscriptions using Stripe.

:soon: Implement logic for recovering cards from the trash.

:soon: Implement a method that cleans all the cards in the trash and unvalidated accounts that are more than 30 days old.

:soon: Change the underlying DS for the cards manager from two max-oriented priority queues to a balanced binary search tree. That way, you can visit a any card on the tree much faster on average.

:soon: Read into layout/reflow. Avoid inefficient operations where possible. Starting resources [here](https://gist.github.com/paulirish/5d52fb081b3570c81e3a), [here](https://developers.google.com/speed/docs/insights/browser-reflow) and [here](https://developer.mozilla.org/en-US/Firefox/Performance_best_practices_for_Firefox_fe_engineers).

:soon: Avail newly added tags in the autocomplete suggestions.

:soon: Make the title contenteditable so that LaTEX can render on it. Also update the MathJax configuration to track the title and description on startup.

:soon: Hide the search results once someone clicks away.

:soon: In the sidebar, display the median urgency so that the user can know how to adjust the cards to influence order.

:soon: Add utility in accounts to quickly modify the tags.

### Add a Test Suite for Continuous Testing

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

Objective: write tests using MochaJS. Prevent commits that fail the tests from being merged into master.

I first needed to separate the production database from the test database. If I'm to present this to users, I can't risk wiping their data based on a test that went wrong!

[Standard](https://www.softwaretestinghelp.com/web-application-testing/) testing for web applications include:

* **Functionality testing:**

  * Valid links (outgoing, internal, same page, email links) and no orphan pages.
  * Forms - field validation, field defaults, wrong inputs and error messages.
  * Enable/disable cookies. Are cookies encrypted?

* **Usability Testing:**

  * Website should be easy to use. Provide placeholders and help tools.
  * The main menu should be on every page.
  * Content checking. Proper display of fonts & images.
  * 'Search on the site' and sitemaps (optional).

* **Interface Testing:**

  * The main interfaces are: web server <--> app server, app server <--> db server
  * Check all interacting points. How are errors handled?
  * What if the user/network interrupts any transaction in between?

* **Compatibility Testing:**

  * Browser compatibility especially JavaScript, AJAX calls & validations.
  * How does it look on mobile?

* **Performance Testing:**

  * Application performance on different connection speeds.

### Setup a Mail Server

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

Using Gmail is great for testing, but Gmail restricts me from autheticating from suspicious devices (e.g. Heroku's servers). I have chosen to setup [MailGun](https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-with-smtp-or-api) which provides 10,000 free emails per month.

### Add an Accounts Page

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

I think the barebones for the Study Buddy Account page are:

* Being able to download one's data. (Implemented)
* Being able to delete one's account. (Implemented)
* Recovering cards from the trash. (Implemented)

Anything else (e.g. avatars, themes) will be considered after observing usage patterns and deciding what feature is worth adding. Of the top of my head, stuff that would be worth looking into are:

* Importing cards from a JSON file.
* Creating a PDF cheatsheet from a selection of tags.

### Implement a Card Review System

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

[Spaced Repitition](https://en.wikipedia.org/wiki/Spaced_repetition) is commonly practised when a user has to retain a large amount of information indefinitely. It exploits the [Spacing Effect](https://en.wikipedia.org/wiki/Spacing_effect), the phenomenon whereby learning is greater when studying is spread out over time, as opposed to studying the same amount of content in a single session.

Flash card software usually adjusts the spacing time based on whether the user provided the right answer. Unlike vocabulary-based flash cards, most of my cards don't have an answer that can be checked trivially. I'll thus depend on the user updating the urgency attribute in lieu of providing an answer to the flash card. Since the cards are shown in decreasing order of urgency, cards that are ranked lower will appear much later in subsequent review sessions.

Two immediate concerns come to mind:

1. Support a `Review Mode` setting that automatically saves the card whenever the urgency attribute is changed, and advances to the next card in the queue. This saves the user from having to click the `Save` and the `Next Card` buttons. (Implemented)

1. Over time, the urgencies on the cards might drift towards zero. I don't really know what to do about this. There's a chance that the user will be adding new cards over time (and these new cards are likely to have mid/high urgencies) or that the user will find a card that they wish to see more often (and thus raise the urgency). Depending on which of the two scenarios pan out, I'll decide whether additional code is needed to mitigate this. (Pending)

### Enhance the Tagging System

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

I need a tags convention. I chose white-space delimited tags. For instance, multiple card tags would be entered as follows: `string_processing algorithms dynamic_programming`.

I currently have 100 cards and 63 unique tags. Ideally, I want to have as many cards as I want and the fewest tags possible while making sure that the tags are descriptive. I can't afford to have near tags such as `searching` and `search` at the same time. Who knows if 3 weeks from now I'll start tagging cards using `information_retrieval` instead of `search`. There are three levels at which I can approach this. Level 1 is the least sophisticated while Level 3 is the most sophisticated. I'll start by implementing Level 1. If Level 1 isn't satisfactory (based on how I use Study Buddy), I'll implement Level 2, and maybe even Level 3.

#### Level 1 (Implemented)

If the user starts typing `pr`, I should provide `probability`, and `primes` as autocomplete options. I trust the user will choose an existing option when applicable. This approach will reduce spelling variations, e.g. `searching` vs `search`. The autocomplete options come from the tags that a user has already used. The major shortcoming is that the user needs to type a similar tag which starts with the same spelling, e.g. `chance` will never cause `probability` to come up in the autocomplete result set. A trie is sufficient for this purpose.

#### Level 2

I can also provide some naive suggestions based on how similar/related tags are. There are two ways of determining this.

I can infer similarity based on how tags have been used in the past, e.g. if the user types `trees`, and there's already a card that has `trees, data_structures, search` as tags, I should recommend `data_structures` and `search` as well. This looks like a graph problem.

It's also possible to build a graph of words based on an external dataset. Such a graph would have nodes like `markov_chain` and `probability` connected by an edge with a greater weight than say `markov_chain`-->`poisson`. This approach can suggest tags that have not been used before. However, this 'knowledge graph' isn't readily available. I might have to make it myself.

#### Level 3

The Level 1 & 2 approaches are agnostic of the content contained inside the card and suffer from cold starts. Level 3 involves building a content-based recommendation system. Song et. al's [Automatic Tag Recommendation Algorithms for Social Recommender Systems](misc_resources/automatic_tag_recommendation_algos_for_social_recommender_systems.pdf) discusses different recommendation systems ranging from 25% precision up to 40% accuracy. If Level 1 and 2 fall below 15% I'll consider implementing one of the systems in Song's paper. For now, let's keep things simple until we can't.

### Support Text Search for Cards

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

Plan: Have a search bar for taking in queries. Provide at most 7 results. Update the search results whenever the user hits SPACE or ENTER (reduces # queries to the database).

Challenges: Provide relevant search results (rank them before returning them). Don't transfer more data than necessary (return only snippets, maybe title plus first line).

Search should be relevant and fast, erring on the side of relevance. Connecting to the database is slow. Luckily, `mongoose` allows me to maintain a persistent connection to the database. Studying the docs helps one make efficient queries and capture some low-hanging fruit. For instance, using `where(some_js_expression)` in MongoDB is expensive because `some_js_expression` will be evaluated for every document in the collection. ~~Using regex inside the query itself is more efficient.~~ MongoDB supports [text search](https://docs.mongodb.com/v3.2/text-search/) and a 'sort by relevance' function. Yay!

I want to strike a balance between making frequent hits to the database and providing search feedback as the user types. Whenever a user hits SPACE after at least one word, I query the database for 7 results and display their titles in the dropdown menu on the search bar. If the user clicks on any of the 7 results, I display the entire card and terminate the search. If the user hits ENTER, then I query the database for all cards that match the query. These cards are then fed into the cards manager, and the user can browse them at their own pace.

To minimize the amount of data being transferred between the client and the database as the user types a query, the server returns partial cards to a search query. These partial cards contain the `_id, urgency, title` fields and nothing else. I display the titles in the dropdown menu that gets updated as the user continues searching. Once the user has decided on which card(s) to view, I use the already built functions to load the card, i.e. first check if the card is in the cache, otherwise, fetch the full card from the database.

### Persistent Session Management

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

I am using [express-session](https://github.com/expressjs/session) and some custom middleware to support persistent logins. In case I'll need to support Facebook/Twitter/Google logins in the future, I'll use [passport](http://www.passportjs.org/docs/configure/). For now, Passport is an overkill.

When a user successfully logs in, I set a token that will be sent on all subsequent requests. Once I receive any request that needs a logged in user, I automatically log in a user if the token provided is valid. If the cookie is invalid (e.g. after a password reset or after 30 days), I redirect them to the login page.

When a user logs out, I delete the token that I issued upon their initial login and redirect them to the welcome/login page. In case a user resets their password, I also invalidate all previously issued tokens.

### LogIn, SignUp and Account Recovery

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

I found CrackStation's piece on [salted password hashing](https://crackstation.net/hashing-security.htm) informative. I store a hash and a salt on the database, and every time a user logs in, I validate the submitted password using the salt and the hash. The [Stanford Crypto Library](http://bitwiseshiftleft.github.io/sjcl/doc/) provided good tools for handling the encryption methods.

When someone tries registering for a new account with a used email address, I ask them to check the email address for a confirmation email. However, the email that I sent tells the email address owner that someone tried registering for an account using their email, and suggests a password reset since if the person who tried to register is legitimate, then they'd benefit from setting a new password. If a new user submits a username that's already in use, I let them know that the username is already in use - something had to give. With sufficient patience, it's possible to enumerate valid usernames, but at least usernames don't have to be obviously linked to a specific person. If need be, I could set up a CAPTCHA before revealing that a username is already taken to slow down enumeration of usernames.

Once an account is registered, the user needs to click on a validation link sent to the submitted email. The user cannot log into Study Buddy before the email address is verified. I'll be (hopefully) short on space, so any unvalidated accounts older than 30 days will get deleted from the database.

Logging in should be as painless as possible. Since the usernames only contain `[_\-A-Za-z0-9]+`, I can infer whether the submitted string was an email address or a username, and authenticate accordingly. If the username/email/password is incorrect, I send a generic `Invalid username/email or password` message without disclosing which is incorrect. Again, it's possible to enumerate usernames, so this is not entirely foolproof. If the credentials provided were correct ~~but the email account has not been verified, I resend a validation URL to their email, and request them to first validate their account. Otherwise,~~ I log them in to Study Buddy.

Users can reset their passwords in case they forget them. First, the user submits the email address associated with their Study Buddy account. If the account exists, I send an email containing a password reset link that is valid for 2 hours, or until it's used, whichever comes earlier.

### Make card navigation more user-friendly

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

I chose to display the tags appearing on the sidebar in decreasing order of importance. As opposed to tag frequency, I weighted each tag by summing up the urgencies of all the cards that the tag is included in. This better captures the relative importance of the tags.

In addition to sorting cards in the underlying priority queue by urgency, I added an additional integer that denotes the insertion order. This enables the PQ to be stable. For instance, if the user views the cards A then B then C, pressing the previous button will visit the cards in reverse order, even when A, B and C have the same priority.

I overrode the default action of the left and right arrow keys when the user is viewing a set of cards. The left arrow key shows the previous card, while the right arrow key shows the next card. However, when the user is editing the cards, the left and right arrow keys default back to their usual behavior.

### Make editing of cards more user-friendly

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

About supporting tabs in the card description, I chose to insert `&nbsp;&nbsp;&nbsp;&nbsp;` if the user pressed the tab key. The downside to this is that deleting a 'tab' requires 4 backspaces. I tried inserting a tab character instead but for it to render, I needed to add `white-space: pre-wrap;` as a style attribute. This however inserts to much whitespace when between separate lines of texts. Since flash cards are more frequently read than written, I prioritized having the flash cards as compact as possible in order to avoid the need to scroll down when reading them.

Previously, users had to escape the LaTEX delimiter themselves and also escape underscores within inline LaTEX. This meant lines like `\(p_i = 2\)` had to be written as `\\(p\_i = 2\\)`. ~~With some regular expressions, I was able to support the former approach. I traded computational efficiency *(more code to automatically escape backslashes and replace automatically inserted `<em>, </em>` tags)* for convenience *(users entering normal LaTEX)*. I choose to make this correction on the client side since I can't afford that much storage capacity on the server side.~~ I configured `showdown.converter` to escape underscores and asterisks when converting markdown to HTML. Although I had activated these options before, `showdown.converter` wasn't applying them. The bug was fixed on Github. I thus downloaded the version of `showdown.min.js` available during commit `039dd66256e771716c20a807a2941974ac7c5873`. Since that version works fine, I choose to use my downloaded copy instead of using the version hosted on the CDN since that might change over time. Later versions of the file insert extra whitespace in my code blocks, so I prefer maintaining the version from the above commit.

I changed the urgency input from a number input type to a range input type. To set an urgency, using the range input type is faster since the user doesn't really care about the actual value, but its percentage, e.g. *card X is half as important as the most important cards in my deck*. Furthermore, using a range requires one click, while using a number type requires a click and a type.

### Support ~~deleting a card~~ moving a card to the trash and undoing the move

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

I learned that I should [never use a warning when I meant undo](http://alistapart.com/article/neveruseawarning). Seems like a good design decision. Users who really want to delete a card might be unsatisifed, but I'll soon implement a clean up script that automatically deletes cards that are in the trash and are more than 30 days old. Amazing how much fiddling goes in the backend, just to allow a user to delete and then save themselves 3 seconds later by hitting `Undo`.

### Organize how data will be represented in the database

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

I choose MongoDB mainly because it's schemaless - I didn't yet have a crystal-clear vision of how the data end of the web app would turn out. I also found [Mongoose](http://mongoosejs.com/) convenient for a quick start in using MongoDB in Node. [mLab](https://www.mlab.com/) provides a nice free tier (512 MB). In case this project ever blows up, I might need to get a more robust service with backups and all, but right now, problems of scale are quite imaginary. It's better to get everything working for cheap than to bleed cash on the off-chance that this project is a goldmine.

As of now, the user's profile is in one document. The user's profile contains links to metadata documents. Each metadata document has a list of the cards owned by the user who owns the metadata document, and some high level stats like how many cards have a given tag. Each card is a separate document, but it also has information on who owns it. `User, Card, MetadataDoc` have all been writen as Mongoose schemas.

### Render card content appropriately

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

I found the [highlight.js](https://highlightjs.org/) library useful for syntax highlighting. It even allows me to specify what languages I want supported. I downloaded a package from them instead of using a CDN. Although I refrain from adding more dependencies, writing my own syntax highlighter would have been unwise.

[MathJAX](https://www.mathjax.org/) renders my LaTEX. At first I had problems getting LaTEX to render properly, but I realized that by default, MathJAX expects LaTEX to be already on the DOM. I dug through its documentation and I found out that MathJAX allows manual reloads. I therefore added a function that requests MathJAX to re-render the contents of the card template every time I load a different card.

Since I'm targeting users that store somewhat detailed flashcards, I felt that Markdown (in addition to LaTEX and syntax highlighting) will prove more useful. Manually converting markdown to HTML is a project by itself. Since it's not the main purpose of Study Buddy, I was happy to import [Showdown](https://github.com/showdownjs/showdown). The library looks mature and the documentation is sound.

I've also added support for one spoiler per card. The format is:

```markdown
What's the general approach for solving problems on probability?

[spoiler]

* Find the sample space \(S\). Draw a tree if \(S\) is not too large.

* From the leaves, define the events of interest. Don't be fooled by their frequency!

* Determine the probabilities along the edges using the assumptions made in the problem. The probability of an outcome is the product of all edge probabilities along the path from the root to the outcome. This is mechanical.

* Compute event probabilities by adding up probabilities for all favorable outcomes.

```

Any content found under the first `[spoiler]` is assumed to be part of the spoiler.

### Add a sidebar that supports filters based on tags

<sub><sup>[:arrow_up: Back to top](#tasks)</sup></sub>

The sidebar shows which tags are available as clickable buttons. Once the user clicks on a tag(s), they can then click the filter button to only show cards that have that filter. I am using two priority queues to control the card flow, one for the cards that are yet to be seen, and the other for the cards that have already been seen. I used notes from COS 226 on PQs to re-write the Java implementation of a PQ into JavaScript, then absracted away the underlying PQ into a cards manager that could be queried for `next_card(), previous_card()`, etc. Although PQ packages exist on NPM, implementing a barebones version is good enough for me.
