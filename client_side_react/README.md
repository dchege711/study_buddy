## Client Side for Study Buddy

### Functionality

:soon: Increment the counts in the sidebar within the app without the user having to log out first.

    * Calling ReactDOM.render() on an existing component doesn't seem to work. The calls don't get registered.

:white_check_mark: Update the metadata once the cards change. (This was moved to the server)

:white_check_mark: Although CardManager is controlled, make it somewhat autonomous - it should be able to handle all operations on its current card.

### Efficiency

:soon: To reduce the number of re-renders, store all the changes in a buffer, and then only call SetState() at the very end of the process.

:soon: Implement a PQ in AppManager.cardHasBeenModified. Client side PQ seems to be a better idea

### Aesthetics

:soon: Damn, the login page is ugly. Spice up the CSS.

:soon: Code snippets should not overflow past the card's boundaries.

:soon: Have some artwork to fill in the blank space in the login page.

:soon: Increase the lower padding on the sidebar. Some tags are being left out. Move the 'Apply Filter' button to the navbar so that it's always accessible.

:broken_heart: I wasn't able to add TeX support to the cards. 

    * <img src="https://github.com/dchege711/study_buddy/blob/master/images/failed_to_support_latex.png" width="400px" height="400px">
    * I think the [MathJAX](https://docs.mathjax.org/en/latest/start.html) only works on TeX that is not printed by ReactJS. 
    * React probably preserves the state of its rendered components and doesn't allow outside scripts to take effects. 
    * It's possible that when I call apply CSS, React handles that under the hood. There's no under the hood support for TeX, yet.

### User Experience

:soon: Smoothen the next button. Eliminate the lag between the next/previous buttons and the card being displayed.

:soon: When a person applies a filter, reload CardManager to show a card among those that have been chosen.

:soon: Order the tags by their importance (summing up their urgencies is a good way to go)