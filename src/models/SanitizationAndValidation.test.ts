import { expect } from 'chai';

import { sanitizeCard } from './SanitizationAndValidation.js';

describe('HTML Transformations', function () {
  it('should convert markdown to HTML', function () {
    const result = sanitizeCard({
      description: 'This is a **bold** text',
    });
    expect(result.descriptionHTML).to.eq(
      '<p>This is a <strong>bold</strong> text</p>\n'
    );
  });

  describe('Syntax Highlighting', function () {
    // Helper value for identifying highlighted code blocks.
    const hljsSentinel = '<pre><code class="hljs';

    it('should highlight code blocks with a language hint', function () {
      const result = sanitizeCard({
        description: '```js\nlet x = 1;\nconst y = 2;\n```',
      });
      expect(result.descriptionHTML).satisfies(function (s: string) {
        return s.startsWith(hljsSentinel);
      }, result.descriptionHTML);
    });

    it('should highlight code blocks without a language hint', function () {
      const result = sanitizeCard({
        description: '```\nlet x = 1;\nconst y = 2;\n```',
      });
      expect(result.descriptionHTML).satisfies(function (s: string) {
        return s.startsWith(hljsSentinel);
      }, result.descriptionHTML);
    });

    it('should not highlight inline code', function () {
      const { descriptionHTML } = sanitizeCard({
        description: 'This is `inline code`',
      });
      expect(descriptionHTML).to.eq('<p>This is <code>inline code</code></p>\n');
    });

    it('should limit highlighting to code blocks', function () {
      const result = sanitizeCard({
        description: '```js\nlet x = 1;\n```\nSome `inline code` followed by a code block\n```js\nlet y = 2;\n```',
      });
      expect(result.descriptionHTML).satisfies(function (s: string) {
        return s.startsWith(hljsSentinel);
      }, result.descriptionHTML);
      expect(result.descriptionHTML).to.include(`<p>Some <code>inline code</code> followed by a code block</p>\n${hljsSentinel}`);
    });
  });

  describe('LaTeX', function () {
    it('should render LaTeX text', function () {
      const { descriptionHTML } = sanitizeCard({
        description: String.raw`$$e = mc^2$$`,
      });
      expect(descriptionHTML, descriptionHTML).to.include('<span class="katex">');
    });

    it('should not affect non-LaTeX text', function () {
      const description = 'This string has no math in it.';
      const { descriptionHTML } = sanitizeCard({ description });
      expect(descriptionHTML, descriptionHTML).to.eq(`<p>${description}</p>\n`);
    });

    it('should not affect non-LaTeX parts of the text', function () {
      const { descriptionHTML } = sanitizeCard({
        description: String.raw`Einstein theorized \(e = mc^2\) in his paper.`,
      });
      expect(descriptionHTML).satisfies(function (s: string) {
        return s.startsWith(`<p>Einstein theorized <eq><span class="katex">`);
      }, descriptionHTML);
    });
  });
});
