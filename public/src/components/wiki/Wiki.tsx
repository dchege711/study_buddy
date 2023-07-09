import React from "react";

import { APP_NAME } from "../../../../config";

function TableOfContents() {
  return (
    <div className="details_section">
      <h3 className="details_header" id="help_contents">
        Wiki Contents
      </h3>

      <ol>
        <li>
          <a href="#formatting">Formatting Cards</a>
        </li>
        <li>
          <a href="#tagging_system">The Tagging and Urgency System</a>
        </li>
        <li>
          <a href="#urgency_bars">The Urgency Bars</a>
        </li>
        <li>
          <a href="#review_mode">Review Mode</a>
        </li>
        <li>
          <a href="#public_cards">Public vs. Private Cards</a>
        </li>
      </ol>
    </div>
  );
}

function BackToTheTop() {
  return (
    <>
      <sup>
        <sup>
          <a href="#help_contents">back to the top</a>
        </sup>
      </sup>
    </>
  );
}

function formattingCardsSection() {
  return (
    <div className="details_section">
      <h3 className="details_header" id="formatting">
        Formatting Cards
        <sup>
          <sup>
            <a href="#help_contents">back to the top</a>
          </sup>
        </sup>
      </h3>

      <p>
        {APP_NAME} supports LaTeX, Markdown and syntax highlighting.
        <table className="w3-table-all">
          <tr>
            <th>You type:</th>
            <th>After saving the card, you'll see:</th>
          </tr>

          <tr>
            <td className="escape_latex">
              \(y = \frac&#123;x^2&#125; &#123;\sqrt{2}&#125; \)
            </td>
            <td>\(y = \frac&#123;x^2&#125;&#123;\sqrt{2}&#125;\)</td>
          </tr>

          <tr>
            <td>
              * Asterisks denote bullets. ~~Strikethrough~~, **bold**, *italics*
            </td>
            <td>
              <li>
                Asterisks denote bullets. <del>Strikethrough</del>,{" "}
                <strong>bold</strong>, <em>italics</em>
              </li>
            </td>
          </tr>

          <tr>
            <td>
              <pre>
                <code className="markdown">
                  ```python
                  <br />
                  def hello_world():
                  <br /> print("Hello, World!")
                  <br />
                  ```
                </code>
              </pre>
            </td>
            <td>
              <pre>
                <code>
                  def hello_world():
                  <br /> print("Hello, World!")
                </code>
              </pre>
            </td>
          </tr>

          <tr>
            <td>
              <pre>
                <code className="markdown">
                  What happens under the hood when a C <br />
                  program is being compiled? <br />
                  <br />
                  [spoiler]
                  <br />* The C code is translated to assembly.
                  <br />* The compiler checks that calls of functions <br />
                  match the declarations that were inserted in the <br />
                  pre-processing stage.
                </code>
              </pre>
            </td>
            <td>
              Effect:{" "}
              <em>
                The content that appears after the [spoiler] tag will be covered
                by a gray box. If you hover over or click on the gray box, the
                hidden text will appear. This is useful for quizzing yourself.
              </em>
            </td>
          </tr>
        </table>
        <ul>
          <li>
            If you're new to LaTeX, the{" "}
            <a href="https://en.wikibooks.org/wiki/LaTeX">LaTeX Wikibook</a>
            is a good introduction. ShareLaTeX docs (now owned by Overleaf) has
            some{" "}
            <a href="https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes">
              pretty good tutorials too!
            </a>
          </li>

          <li>
            I suggest using markdown to make your cards pretty. Here's a{" "}
            <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">
              Markdown Cheatsheet
            </a>{" "}
            to get you started.
          </li>
        </ul>
      </p>

      <p>
        <h5>Images</h5>
        To insert images, I suggest using Markdown. Specify the size of your
        image so that it renders well on the card. For now, {APP_NAME} doesn't
        host any images. Use image hosting sites such as Imgur and then paste
        the hyperlink to your flashcard. For example,
        <br />
        <br />
        <code className="markdown">
          ![bayes](https://imgs.xkcd.com/comics/modified_bayes_theorem.png
          =60%x80%)
        </code>
        <br />
        <br />
        renders this image (the dimensions have the format WIDTH x HEIGHT):
        <br />
        <br />
        <img
          src="https://imgs.xkcd.com/comics/modified_bayes_theorem.png"
          alt="bayes"
          width="60%"
          height="80%"
        />
      </p>
    </div>
  );
}

export function Wiki() {
    return (
        <div id="study_buddy_details">
            {TableOfContents()}
            {formattingCardsSection()}
        </div>
    )
}
