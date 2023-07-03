const hljs = require('./lib/highlight.pack.js');

/**
 * @description We found the [highlight.js]{@link https://highlightjs.org/}
 * library useful for syntax highlighting. It even allows us to specify
 * what languages we want supported. We downloaded a package from them
 * instead of using a CDN. Although we refrain from adding more
 * dependencies, writing our own syntax highlighter would have been unwise.
 */
export function addSyntaxHighlighting () {
  let code_elements = document.querySelectorAll('pre code');
  for (let i = 0; i < code_elements.length; i++) {
      hljs.highlightBlock(code_elements[i]);
  }
}
