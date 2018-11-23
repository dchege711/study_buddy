#!/bin/bash

# Clean up processes that run in the background
function cleanup {
    echo -e "\nClosing the app instance...\n"
    pkill node ../../server.js
}

cleanup # Clean the workspace before running anything
trap cleanup EXIT # Run the cleanup routine before exiting this script

node_with_options="node --no-deprecation"

$node_with_options ../../server.js & # Spin up the server
sleep 1.5 # Enough time for the server to initialize

browser_to_test=`echo "$1" | tr '[:upper:]' '[:lower:]'`

if [[ $browser_to_test == "all" ]] || [[ $browser_to_test == "chrome" ]]; then
    echo -e "\n__________________\n\nTesting on chrome...\n__________________\n"
    SELENIUM_SERVER_JAR=./selenium-server-standalone-3.8.1.jar SELENIUM_BROWSER=chrome $node_with_options Test.js $2
fi

if [[ $browser_to_test == "all" ]] || [[ $browser_to_test == "safari" ]]; then
    echo -e "\n__________________\n\nTesting on safari...\n__________________\n"
    SELENIUM_SERVER_JAR=./selenium-server-standalone-3.8.1.jar SELENIUM_BROWSER=safari $node_with_options Test.js $2
fi

if [[ $browser_to_test == "all" ]] || [[ $browser_to_test == "firefox" ]]; then
    echo -e "\n__________________\n\nTesting on firefox...\n__________________\n"
    SELENIUM_SERVER_JAR=./selenium-server-standalone-3.8.1.jar SELENIUM_BROWSER=firefox $node_with_options Test.js $2
fi
