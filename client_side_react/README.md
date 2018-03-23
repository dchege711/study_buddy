### Client Side for Study Buddy

#### Functionality

:soon: Increment the counts in the sidebar within the app. Actually, finish up cardHasBeenModified() in AppManager.js

:white_check_mark: Update the metadata once the cards change. (This was moved to the server)

:white_check_mark: Although CardManager is controlled, make it somewhat autonomous - it should be able to handle all operations on its current card.

#### Efficiency

:soon: To reduce the number of re-renders, store all the changes in a buffer, and then only call SetState() at the very end of the process.

:soon: Implement a PQ in AppManager.cardHasBeenModified. Client side PQ seems to be a better idea

#### Aesthetics

:soon: Damn, the login page is ugly. Spice up the CSS.

:soon: Code snippets should not overflow past the card's boundaries.

:soon: Have some artwork to fill in the blank space in the login page.

#### User Experience

:soon: Smoothen the next button. Eliminate the lag between the next/previous buttons and the card being displayed.

:soon: When a person applies a filter, reload CardManager to show a card among those that have been chosen.

:soon: Order the tags by their importance (summing up their urgencies is a good way to go)