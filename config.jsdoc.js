"use strict";

/**
 * @description Configuration for JSDoc for building the docs.
 * https://jsdoc.app/about-configuring-jsdoc.html
 */

module.exports = {

    // Instead of specifying these on the command line
    opts: {
        template: "templates/default", 
        readme: "readme.md", 
        encoding: "utf8", 
        destination: "./docs/", 
        recurse: true, 
        tutorials: "wiki/", 
    },

    // Plugins tend to need more configuration. See the plugin site for more info
    plugins: [
        "plugins/markdown",
    ], 

    // How many levels deep should JSDoc search for files? This option is used 
    // only when the `-r` command-line flag is specified
    recurseDepth: 10,

    source: {
        // Step 1: Search for files in these paths
        include: [
            "models/", "public/src/"
        ],

        // Step 2: For each file found in step #1 only consider it if it ends in 
        // .js, .jsx, or .jsdoc
        includePattern: ".+\\.js(doc|x)?$", 

        // Step 3: For each file left from step #2, ignore it if it begins with 
        // an underscore
        excludePattern: "(^|\\/|\\\\)_",

        // Step 4: For each file from step #3, ignore it if its path is here
        exclude: [
            "public/src/AVLTree.js"
        ],
        
    }, 

    // Support code that uses ES2015 modules
    sourceType: "module", 

    tags: {
        // Should JSDoc log a warning when it sees unrecognized tags in docstrings?
        allowUnknownTags: true,

        // The tags that JSDoc recognizes. The first dict in which a tag is 
        // handled in takes precedence for that tag
        dictionaries: [
            "jsdoc", // Core JSDoc tags
            "closure" // Closure Compiler tags
        ]
    }, 

    // Affect the appearance and content of generated documentation
    templates: {
        // Render @link tags in normal text, monospace otherwise
        cleverLinks: true, 
        
        // Ignored if `cleverLinks` is set
        // monospaceLinks: false, 

        default: {
            // layoutFile: "views/jsdoc.layout.tmpl", 

            staticFiles: {
                include: ["wiki/_img"]
            }
        }
    }
};  