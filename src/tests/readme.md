# Testing

## Test Suite for Continuous Testing

Objective: write tests using MochaJS. Prevent commits that fail the tests from being merged into master.

I first needed to separate the production database from the test database. If I'm to present this to users, I can't risk wiping their data based on a test that went wrong!

## Tests to automate

| Task                                         | UI Sanity Test | API Test |
| -------------------------------------------- | -------------- | -------- |
| Creating a new account                       | Done           | Done     |
| Asserting that the validation link was sent  | N/A            | Done     |
| Clicking the validation link                 | Done           |          |
| Logging into an account                      | Done           |          |
| Logging out of an account                    | Done           |          |
| Changing the password                        | Done           |          |
| Downloading data                             |                |          |
| Update settings for account                  |                |          |
| Deleting an account                          | Done           | Done     |
| Saving a card                                |                | Done     |
| Trashing a card                              |                |          |
| Filtering cards based on tags                |                |          |
| Searching card descriptions and titles       |                |          |
| Review Mode                                  |                | N/A      |
| Restoring a card from the trash              |                |          |
| The previous and next buttons                |                |          |
| Searching for public cards                   |                |          |
| Filtering public cards by tag                |                |          |
| Viewing more of a public card                |                |          |
| Flagging public card for review/multiplicity |                |          |
| Adding a public card to one's collection     |                |          |

[Standard](https://www.softwaretestinghelp.com/web-application-testing/) testing for web applications include:

- **Functionality testing:**

  - Valid links (outgoing, internal, same page, email links) and no orphan pages.
  - Forms - field validation, field defaults, wrong inputs and error messages.
  - Enable/disable cookies. Are cookies encrypted?

- **Usability Testing:**

  - Website should be easy to use. Provide placeholders and help tools.
  - The main menu should be on every page.
  - Content checking. Proper display of fonts & images.
  - 'Search on the site' and sitemaps (optional).

- **Interface Testing:**

  - The main interfaces are: web server <--> app server, app server <--> db server
  - Check all interacting points. How are errors handled?
  - What if the user/network interrupts any transaction in between?

- **Compatibility Testing:**

  - Browser compatibility especially JavaScript, AJAX calls & validations.
  - How does it look on mobile?

- **Performance Testing:**

  - Application performance on different connection speeds.
