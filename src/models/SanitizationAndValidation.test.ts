import { expect } from 'chai';

import { sanitizeCard } from './SanitizationAndValidation.js';

describe('HTML Transformations', function () {
  /**
   * @description Test that the function converts markdown to HTML. We use
   * Showdown to convert markdown to HTML. No need for extensive testing here.
   */
  it('should convert markdown to HTML', function () {
    const result = sanitizeCard({
      description: 'This is a **bold** text',
    });
    expect(result.descriptionHTML).to.eq(
      '<p>This is a <strong>bold</strong> text</p>'
    );
  });

  describe('Syntax Highlighting', function () {
    // Helper value for identifying highlighted code blocks.
    const hljsSentinel = '<pre><code data-highlighted="yes" class="hljs';

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
      const result = sanitizeCard({
        description: 'This is `inline code`',
      });
      expect(result.descriptionHTML).to.eq('<p>This is <code>inline code</code></p>');
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
});
