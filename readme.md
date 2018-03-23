## Server Side Notes for Study Buddy

### Tasks 

:white_check_mark: Have a cleaner way of updating a user's metadata. I associated metadata with a userID. Metadata is separate from the cards.

:x: Client-side username verification and validation for new users.

:white_check_mark: Make the email address as the unique identifier. 

:x: Use email verification to validate accounts.

:white_check_mark: Implement an authenticated log-in process.

:white_check_mark: Parse markdown from the card's content.

:broken_heart: I wasn't able to add TeX support to the cards. 
    * <img src="https://github.com/dchege711/study_buddy/blob/master/images/failed_to_support_latex.png" width="400px" height="400px">
    * I think the [MathJAX](https://docs.mathjax.org/en/latest/start.html) only works on TeX that is not printed by ReactJS. 
    * React probably preserves the state of its rendered components and doesn't allow outside scripts to take effects. 
    * It's possible that when I call apply CSS, React handles that under the hood. There's no under the hood support for TeX, yet.


#### Initial Notes

<img src="https://github.com/dchege711/study_buddy/blob/master/images/version_1.png" width="700px" height="400px">

* Changes made to initial design:
    * The web client runs on ReactJS, but still on Heroku.
    * I'm using mLab's MongoDB service instead of Google Cloud SQL because of cost.
    * The backend logic is written in NodeJS, not in Python.
    

