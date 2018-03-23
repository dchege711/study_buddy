### Study Buddy (Client Side)

### Fixes to make
:x: Functionality: *Increment the counts in the sidebar within the app. Actually, finish up cardHasBeenModified() in AppManager.js*

:x: Efficiency: *To reduce the number of re-renders, store all the changes in a buffer, and then only call SetState() at the very end of the process.*

:x: Aesthetics: *Damn, the login page is ugly. Bump up the CSS*

:x: User Experience: *Smoothen the next button. Eliminate the lag between the next/previous buttons and the card being displayed.*

:x: User Experience: *When a person applies a filter, reload CardManager to show a card among those that have been chosen.*

:x: User Experience: *Order the tags by their importance (summing up their urgencies is a good way to go)*

:x: Efficiency: *Implement a PQ in AppManager.cardHasBeenModified. Client side PQ seems to be a better idea*

:white_check_mark: Functionality: *Decide where changes to metadata should be done. Should you leave that to the server, or should AppManager handle metadata and send an upload at the end?*

:white_check_mark: Functionality: *Although CardManager is controlled, make it somewhat autonomous - it should be able to handle all operations on its current card.*

#### To-Do Items
* Have some artwork to fill in the blank space in the login page.
    * <img src="https://github.com/dchege711/study_buddy/blob/master/images/login_whitespace.png" width="700px" height="400px">
* :white_check_mark: Fix the side bar to go under the navigation bar.