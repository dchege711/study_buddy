## Persistent Session Management

We use [express-session](https://github.com/expressjs/session) and some custom middleware to support persistent logins. In case I'll need to support Facebook/Twitter/Google logins in the future, I'll use [passport](http://www.passportjs.org/docs/configure/). For now, Passport is an overkill.

When a user successfully logs in, we set a token that will be sent on all subsequent requests. Once I receive any request that needs a logged in user, we automatically log in a user if the token provided is valid. If the cookie is invalid (e.g. after a password reset or after 30 days), we redirect them to the login page.

When a user logs out, we delete the token that we issued upon their initial login and redirect them to the welcome/login page. In case a user resets their password, we also invalidate all previously issued tokens.

## LogIn, SignUp and Account Recovery

We found CrackStation's piece on [salted password hashing](https://crackstation.net/hashing-security.htm) informative. We store a hash and a salt on the database, and every time a user logs in, we validate the submitted password using the salt and the hash. The [Stanford Crypto Library](http://bitwiseshiftleft.github.io/sjcl/doc/) provided good tools for handling the encryption methods.

When someone tries registering for a new account with a used email address, we ask them to check the email address for a confirmation email. However, the email that we send tells the email address owner that someone tried registering for an account using their email, and suggests a password reset since if the person who tried to register is legitimate, then they'd benefit from setting a new password.

If a new user submits a username that's already in use, we let them know that the username is already in use - something had to give. With sufficient patience, it's possible to enumerate valid usernames, but at least usernames don't have to be obviously linked to a specific person. If need be, we could set up a CAPTCHA before revealing that a username is already taken to slow down enumeration of usernames.

Once an account is registered, the user needs to click on a validation link sent to the submitted email. ~~The user cannot log into Flashcards by c13u before the email address is verified. I'll be (hopefully) short on space, so any unvalidated accounts older than 30 days will get deleted from the database.~~ We observed a high bounce rate AND few signups. I'll allow accounts with unvalidated email addresses to sign in for at most 30 days.

Logging in should be as painless as possible. Since the usernames only contain `[_\-A-Za-z0-9]+`, I can infer whether the submitted string was an email address or a username, and authenticate accordingly. If the username/email/password is incorrect, I send a generic `Invalid username/email or password` message without disclosing which is incorrect. Again, it's possible to enumerate usernames, so this is not entirely foolproof. If the credentials provided were correct ~~but the email account has not been verified, I resend a validation URL to their email, and request them to first validate their account. Otherwise,~~ I log them in to Flashcards by c13u.

Users can reset their passwords in case they forget them. First, the user submits the email address associated with their Flashcards by c13u account. If the account exists, we send an email containing a password reset link that is valid for 2 hours, or until it's used, whichever comes earlier.
