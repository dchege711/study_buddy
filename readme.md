## Study Buddy

<img src="https://github.com/dchege711/study_buddy/blob/master/images/version_1.png" width="700px" height="400px">

* Changes made to initial design:
    * The web client runs on ReactJS, but still on Heroku.
    * I'm using mLab's MongoDB service instead of Google Cloud SQL because of cost.
    * The backend logic is written in NodeJS, not in Python.

### Tasks 
* Implement the email address as the unique identifier.
* Learn how to do email verification.
* Time the login denials and set the response times so that one can't distinguish between false usernames and false passwords.
* :white_check_mark: Implement the log-in process on the server side.
* :white_check_mark: Figure out how to use config variables in ReactJS scripts, e.g. accessing metadata (Did this on server side)

### Current Developments

* I wasn't able to add TeX support to the cards. 
    * <img src="https://github.com/dchege711/study_buddy/blob/master/images/failed_to_support_latex.png" width="400px" height="400px">
    * I think the [MathJAX](https://docs.mathjax.org/en/latest/start.html) only works on TeX that is not printed by ReactJS. 
    * React probably preserves the state of its rendered components and doesn't allow outside scripts to take effects. 
    * It's possible that when I call apply CSS, React handles that under the hood. There's no under the hood support for TeX, yet.
    
* But I was able to support Markdown formatting for the individual cards. Here's an example:
    * <img src="https://github.com/dchege711/study_buddy/blob/master/images/code_support.png" width="400px" height="400px">
