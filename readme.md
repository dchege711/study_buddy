# Contents

1. [Tasks](#tasks)
1. [Screenshots](#screenshots)

## Tasks

:soon: Use email verification to validate accounts.

:soon: Support extended sessions without requiring a re-login.

:soon: Define a log out procedure and write the required code.

:soon: Client-side username verification and validation for new users.

:soon: Implement logic for recovering cards from the trash.

:soon: Implement a method that cleans all the cards in the trash that are more than 30 days old.

:soon: Support filtering on the first set of filters.

:soon: Include an about page with tutorial on how to use Study Buddy.

:soon: Add an account page with configurable settings, e.g. code syntax theme, light vs dark UI, etc.

:soon: Have fun with the 4xx-code page.

### :soon: LogIn, SignUp and Account Recovery

I found CrackStation's piece on [salted password hashing](https://crackstation.net/hashing-security.htm) informative. I store a hash and a salt on the database, and every time a user logs in, I validate the submitted password using the salt and the hash. The [Stanford Crypto Library](http://bitwiseshiftleft.github.io/sjcl/doc/) provided good tools for handling the encryption methods.

When someone tries registering for a new account with a used email address, I ask them to check the email address for a confirmation email. However, the email that I sent tells the email address owner that someone tried registering for an account using their email, and suggests a password reset since if the person who tried to register is legitimate, then they'd benefit from setting a new password. If a new user submits a username that's already in use, I let them know that the username is already in use - something had to give. With sufficient patience, it's possible to enumerate valid usernames, but at least usernames don't have to be obviously linked to a specific person. If need be, I could set up a CAPTCHA before revealing that a username is already taken to slow down enumeration of usernames.

Once an account is registered, the user needs to click on a validation link sent to the submitted email. The user cannot log into Study Buddy before the email address is verified. I'll be (hopefully) short on space, so any unvalidated accounts older than 30 days will get deleted from the database.

Logging in should be as painless as possible. Since the usernames only contain `[_\-A-Za-z0-9]+`, I can infer whether the submitted string was an email address or a username, and authenticate accordingly. If the username/email/password is incorrect, I send a generic `Invalid username/email or password` message without disclosing which is incorrect. Again, it's possible to enumerate usernames, so this is not entirely foolproof. If the credentials provided were correct but the email account has not been verified, I resend a validation URL to their email, and request them to first validate their account. Otherwise, I log them in to Study Buddy.

Users can reset their passwords in case they forget them. First, the user submits the email address associated with their Study Buddy account. If the account exists, I send an email containing a password reset link that is valid for 2 hours, or until it's used, whichever comes earlier.

### :white_check_mark: Make card navigation through the GUI more user-friendly

I chose to display the tags appearing on the sidebar in decreasing order of importance. As opposed to tag frequency, I weighted each tag by summing up the urgencies of all the cards that the tag is included in. This better captures the relative importance of the tags.

In addition to sorting cards in the underlying priority queue by urgency, I added an additional integer that denotes the insertion order. This enables the PQ to be stable. For instance, if the user views the cards A then B then C, pressing the previous button will visit the cards in reverse order, even when A, B and C have the same priority.

### :white_check_mark: Make editing of cards more user-friendly

About supporting tabs in the card description, I chose to insert `&nbsp;&nbsp;&nbsp;&nbsp;` if the user pressed the tab key. The downside to this is that deleting a 'tab' requires 4 backspaces. I tried inserting a tab character instead but for it to render, I needed to add `white-space: pre-wrap;` as a style attribute. This however inserts to much whitespace when between separate lines of texts. Since flash cards are more frequently read than written, I prioritized having the flash cards as compact as possible in order to avoid the need to scroll down when reading them.

Previously, users had to escape the LaTEX delimiter themselves and also escape underscores within inline LaTEX. This meant lines like `\(p_i = 2\)` had to be written as `\\(p\_i = 2\\)`. With some regular expressions, I was able to support the former approach. I traded computational efficiency *(more code to automatically escape backslashes and replace automatically inserted `<em>, </em>` tags)* for convenience *(users entering normal LaTEX)*. I choose to make this correction on the client side since I can't afford that much storage capacity on the server side.

I changed the urgency input from a number input type to a range input type. To set an urgency, using the range input type is faster since the user doesn't really care about the actual value, but its percentage, e.g. *card X is half as important as the most important cards in my deck*. Furthermore, using a range requires one click, while using a number type requires a click and a type.

### :white_check_mark: Implement logic for ~~deleting a card~~ moving a card to the trash and undoing it within 10 seconds

I learned that I should [never use a warning when I meant undo](http://alistapart.com/article/neveruseawarning). Seems like a good design decision. Users who really want to delete a card might be unsatisifed, but I'll soon implement a clean up script that automatically deletes cards that are in the trash and are more than 30 days old. Amazing how much fiddling goes in the backend, just to allow a user to delete and then save themselves 3 seconds later by hitting `Undo`.

### :white_check_mark: Handle changes made on cards

Unlike changing the contents of the description or the title of a card, changing the tags or urgency of a card isn't a local event. The metadata has to be updated such changes. The user may create a new tag that didn't exist before; the user might delete the only card that had a given card, etc. Such cases need to be handled appropriately.

### :white_check_mark: Organize how data will be represented in the database

I choose MongoDB mainly because it's schemaless - I didn't yet have a crystal-clear vision of how the data end of the web app would turn out. I also found [Mongoose](http://mongoosejs.com/) convenient for a quick start in using MongoDB in Node. [mLab](https://www.mlab.com/) provides a nice free tier (512 MB). In case this project ever blows up, I might need to get a more robust service with backups and all, but right now, problems of scale are quite imaginary. It's better to get everything working for cheap than to bleed cash on the off-chance that this project is a goldmine.

As of now, the user's profile is in one document. The user's profile contains links to metadata documents. Each metadata document has a list of the cards owned by the user who owns the metadata document, and some high level stats like how many cards have a given tag. Each card is a separate document, but it also has information on who owns it. `User, Card, MetadataDoc` have all been writen as Mongoose schemas.

### :white_check_mark: Parse markdown from the card's content

Since I'm targeting users that store somewhat detailed flashcards, I felt that Markdown (in addition to LaTEX and syntax highlighting) will prove more useful. Manually converting markdown to HTML is a project by itself. Since it's not the main purpose of Study Buddy, I was happy to import [Showdown](https://github.com/showdownjs/showdown). The library looks mature and the documentation is sound.

### :white_check_mark: Render LaTEX on the cards

[MathJAX](https://www.mathjax.org/) renders my LaTEX. At first I had problems getting LaTEX to render properly, but I realized that by default, MathJAX expects LaTEX to be already on the DOM. I dug through its documentation and I found out that MathJAX allows manual reloads. I therefore added a function that requests MathJAX to re-render the contents of the card template every time I load a different card.

### :white_check_mark: Implement the sidebar and filter

The sidebar shows which tags are available as clickable buttons. Once the user clicks on a tag(s), they can then click the filter button to only show cards that have that filter. I am using two priority queues to control the card flow, one for the cards that are yet to be seen, and the other for the cards that have already been seen. I used notes from COS 226 on PQs to re-write the Java implementation of a PQ into JavaScript, then absracted away the underlying PQ into a cards manager that could be queried for `next_card(), previous_card()`, etc. Although PQ packages exist on NPM, implementing a barebones version is good enough for me.

### :white_check_mark: Prettify the scripts found inside the cards

I found the [highlight.js](https://highlightjs.org/) library useful for this. It even allows me to specify what languages I want supported. I downloaded a package from them instead of using a CDN. Although I refrain from adding more dependencies, writing my own syntax highlighter would have been unwise.

## Screenshots

![Login Page](https://github.com/dchege711/study_buddy/blob/master/data/login_page.png)

![Sample Card](https://github.com/dchege711/study_buddy/blob/master/data/sample_card.png)