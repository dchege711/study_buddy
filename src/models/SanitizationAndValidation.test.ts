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

  it('should highlight code blocks', function() {
    // We use Showdown to convert markdown to HTML, which doesn't support the
    // language hint syntax for code blocks.
    const result = sanitizeCard({
      description: '```js\nlet x = 1;\nconst y = 2;\n```',
    });
    expect(result.descriptionHTML).satisfies(function (s: string) {
      return s.startsWith('<pre><code data-highlighted="yes" class="hljs');
    });
  });
});
