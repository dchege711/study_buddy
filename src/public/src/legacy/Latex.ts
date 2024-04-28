// Will be overwritten in src/views/partials/syntax_highlighting_and_latex.ejs.
let latexImplementation = (elementIDs: string[]) => {};

export function renderLatex(elementIDs: string[]): void {
  latexImplementation(elementIDs);
}
