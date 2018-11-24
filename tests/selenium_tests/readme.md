# Selenium Tests

* If running the tests for the first time, make the shell script executable by running `$ chmod 700 run_selenium_tests.sh`
* To run the tests in this folder, run `$ ./run_selenium_tests.sh`

## Setup Notes

* The Chrome driver was obtained from running `$ brew cask install chromedriver`
* The Firefox driver was downloaded from [https://github.com/mozilla/geckodriver/releases/download/v0.21.0/geckodriver-v0.21.0-macos.tar.gz](https://github.com/mozilla/geckodriver/releases/download/v0.21.0/geckodriver-v0.21.0-macos.tar.gz) and the executable's folder was added to `$PATH`.
* The Safari driver came bundled with Safari, but I had to check `Develop -> Allow Remote Automation`. The developer menu is activated by `Preferences -> Advanced -> Show Develop in menu`.

## Test Notes

* The tests fail for Safari. Not my fault: https://github.com/SeleniumHQ/selenium/issues/5355