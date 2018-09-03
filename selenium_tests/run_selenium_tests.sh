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

echo -e "\n__________________\n\nTesting on chrome...\n__________________\n"
SELENIUM_SERVER_JAR=./selenium-server-standalone-3.8.1.jar SELENIUM_BROWSER=chrome node Test.js

echo -e "\n__________________\n\nTesting on safari...\n__________________\n"
SELENIUM_SERVER_JAR=./selenium-server-standalone-3.8.1.jar SELENIUM_BROWSER=safari node Test.js

echo -e "\n__________________\n\nTesting on firefox...\n__________________\n"
SELENIUM_SERVER_JAR=./selenium-server-standalone-3.8.1.jar SELENIUM_BROWSER=firefox node Test.js
