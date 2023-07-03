const MathJax = require("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML");

/**
 * @description At first we had problems getting LaTEX to render
 * properly, but we realized that by default, MathJAX expects LaTEX to
 * be already on the DOM. We dug through its documentation and found
 * out that MathJAX allows manual reloads. We therefore added a
 * function that requests MathJAX to re-render the contents of the card
 * template every time the user loads a card.
 *
 * {@tutorial main.editing_cards}
 *
 * @param {Array} elementIDs
 * @returns {Void} Modifies the DOM in place
 */
export function renderLatex(elementIDs: string[]) {
  for (let i = 0; i < elementIDs.length; i++) {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, elementIDs[i]]);
  }
}
