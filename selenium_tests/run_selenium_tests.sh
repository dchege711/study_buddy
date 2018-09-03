#!/bin/bash

# Clean up processes that run in the background
function cleanup {
    echo -e "\nClosing Study Buddy server...\n"
    pkill node ../server.js
}

cleanup # Clean the workspace before running anything
trap cleanup EXIT # Run the cleanup routine before exiting this script

# Spin up the servers
node ../server.js &
sleep 1.5 # Enough time for the server to initialize

browser_to_test=`echo "$1" | tr '[:upper:]' '[:lower:]'`

if [ $browser_to_test == "" ] || [ $browser_to_test == "chrome" ]; then
    echo -e "\n__________________\n\nTesting on chrome...\n__________________\n"
    SELENIUM_SERVER_JAR=./selenium-server-standalone-3.8.1.jar SELENIUM_BROWSER=chrome node Test.js
fi

if [ $browser_to_test == "" ] || [ $browser_to_test == "safari" ]; then
    echo -e "\n__________________\n\nTesting on safari...\n__________________\n"
    SELENIUM_SERVER_JAR=./selenium-server-standalone-3.8.1.jar SELENIUM_BROWSER=safari node Test.js
fi

if [ $browser_to_test == "" ] || [ $browser_to_test == "firefox" ]; then
    echo -e "\n__________________\n\nTesting on firefox...\n__________________\n"
    SELENIUM_SERVER_JAR=./selenium-server-standalone-3.8.1.jar SELENIUM_BROWSER=firefox node Test.js
fi