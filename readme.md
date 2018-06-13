# Contents

1. [Tasks](#tasks)
1. [Screenshots](#screenshots)

## Tasks

:soon: The PQ doesn't preserve order when iterating through previous().

:soon: Avail new cards/edits within the same session. Insert them into the PQ. Deleting new cards doesn't work because of this.

:soon: Use email verification to validate accounts.

:soon: Define a log out procedure and write the required code.

:soon: Allow for password resets and account recovery.

:soon: Client-side username verification and validation for new users.

:soon: Implement logic for recovering cards from the trash.

:soon: Implement a method that cleans all the cards in the trash that are more than 30 days old.

:soon: Let users use normal LaTeX without double backslashes. Allow tab characters within the editable content.

:soon: Allow filtering on the first set of filters.

:soon: Include an about page with tutorial on how to use Study Buddy.

:soon: Add an account page with configurable settings, e.g. code syntax theme, light vs dark UI, etc.

:white_check_mark: Implement logic for ~~deleting a card~~ moving a card to the trash and undoing it within 10 seconds. 

I learned that I should [never use a warning when I meant undo](http://alistapart.com/article/neveruseawarning). Seems like a good design decision. Users who really want to delete a card might be unsatisifed, but I'll soon implement a clean up script that automatically deletes cards that are in the trash and are more than 30 days old. Amazing how much fiddling goes in the backend, just to allow a user to delete and then save themselves 3 seconds later by hitting `Undo`.

:white_check_mark: Handle changes made on cards.

Unlike changing the contents of the description or the title of a card, changing the tags or urgency of a card isn't a local event. The metadata has to be updated such changes. The user may create a new tag that didn't exist before; the user might delete the only card that had a given card, etc. Such cases need to be handled appropriately.

:white_check_mark: Organize how data will be represented in the database.

I choose MongoDB mainly because it's schemaless - I didn't yet have a crystal-clear vision of how the data end of the web app would turn out. I also found [Mongoose](http://mongoosejs.com/) convenient for a quick start in using MongoDB in Node. [mLab](https://www.mlab.com/) provides a nice free tier (512 MB). In case this project ever blows up, I might need to get a more robust service with backups and all, but right now, problems of scale are quite imaginary. It's better to get everything working for cheap than to bleed cash on the off-chance that this project is a goldmine.

As of now, the user's profile is in one document. The user's profile contains links to metadata documents. Each metadata document has a list of the cards owned by the user who owns the metadata document, and some high level stats like how many cards have a given tag. Each card is a separate document, but it also has information on who owns it. `User, Card, MetadataDoc` have all been writen as Mongoose schemas.

:white_check_mark: Implement a log-in process.

I found CrackStation's piece on [salted password hashing](https://crackstation.net/hashing-security.htm) informative. I store a hash and a salt on the database, and every time a user logs in, I validate the submitted password using the salt and the hash. The [Stanford Crypto Library](http://bitwiseshiftleft.github.io/sjcl/doc/) provided good tools for handling the encryption methods.

:white_check_mark: Parse markdown from the card's content.

Since I'm targeting users that store somewhat detailed flashcards, I felt that Markdown (in addition to LaTEX and syntax highlighting) will prove more useful. Manually converting markdown to HTML is a project by itself. Since it's not the main purpose of Study Buddy, I was happy to import [Showdown](https://github.com/showdownjs/showdown). The library looks mature and the documentation is sound.

:white_check_mark: Render LaTEX on the cards.

[MathJAX](https://www.mathjax.org/) renders my LaTEX. At first I had problems getting LaTEX to render properly, but I realized that by default, MathJAX expects LaTEX to be already on the DOM. I dug through its documentation and I found out that MathJAX allows manual reloads. I therefore added a function that requests MathJAX to re-render the contents of the card template every time I load a different card.

:white_check_mark: Implement the sidebar and filter.

The sidebar shows which tags are available as clickable buttons. Once the user clicks on a tag(s), they can then click the filter button to only show cards that have that filter. I am using two priority queues to control the card flow, one for the cards that are yet to be seen, and the other for the cards that have already been seen. I used notes from COS 226 on PQs to re-write the Java implementation of a PQ into JavaScript, then absracted away the underlying PQ into a cards manager that could be queried for `next_card(), previous_card()`, etc. Although PQ packages exist on NPM, implementing a barebones version is good enough for me.

:white_check_mark: Prettify the scripts found inside the cards.

I found the [highlight.js](https://highlightjs.org/) library useful for this. It even allows me to specify what languages I want supported. I downloaded a package from them instead of using a CDN. Although I refrain from adding more dependencies, writing my own syntax highlighter would have been unwise.

## Screenshots

![Login Page](https://github.com/dchege711/study_buddy/blob/master/data/login_page.png)

![Sample Card](https://github.com/dchege711/study_buddy/blob/master/data/sample_card.png)