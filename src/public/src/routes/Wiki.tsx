import React from "react";

import { APP_NAME } from "../constants";
import { Link } from "react-router-dom";
import { QuartilesBar } from "../components/cards/EditableCard";

function BackToTheTop() {
  return (
    <sup>
      <sup>
        <a href="#help_contents">back to the top</a>
      </sup>
    </sup>
  );
}

function SectionHeader({ id, text }: { id: string; text: string }) {
  return (
    <h3 className="details_header" id={id}>
      {text}
      {id !== "help_contents" && BackToTheTop()}
    </h3>
  );
}

function TableOfContents() {
  return (
    <>
      {SectionHeader({ id: "help_contents", text: "Wiki Contents" })}
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
    </>
  );
}

function FormattingCards() {
  return (
    <>
      {SectionHeader({ id: "formatting", text: "Formatting Cards" })}
      <p>{APP_NAME} supports LaTeX, Markdown and syntax highlighting.</p>
      <table className="w3-table-all">
        <thead>
          <tr>
            <th>You type:</th>
            <th>After saving the card, you'll see:</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="escape_latex">{`\\(y = \\frac{x^2}{\\sqrt{2}} \\)`}</td>
            <td>{`\\(y = \\frac{x^2}{\\sqrt{2}}\\)`}</td>
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
        </tbody>
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
      <h5>Images</h5>
      <p>
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
    </>
  );
}

function TaggingAndUrgencySystem() {
  return (
    <>
      {SectionHeader({
        id: "tagging_system",
        text: "The Tagging and Urgency System",
      })}

      <p>
        {APP_NAME} categorizes the cards using the tags provided. When
        displaying a set of cards, the cards with higher urgency values are
        shown first.
      </p>
      <br />
      <br />
      <p>
        Tags are case-sensitive. When adding tags to a card, {APP_NAME}
        offers an auto-complete feature in order to reduce the number of
        near-duplicate tags like [<em>sorting_algorithms</em>,{" "}
        <em>sorting-algorithms</em>, <em>Sorting Algorithms</em>].
      </p>
      <br />
      <br />
      <p>
        The importance of a tag is the sum of all the urgencies of the cards
        that bear that tag. For instance, suppose we have this set of cards:
      </p>
      <br />
      <table className="w3-table-all">
        <thead>
          <tr>
            <th>Card ID</th>
            <th>Urgency</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>card_1</td>
            <td>2.0</td>
            <td>a, b</td>
          </tr>
          <tr>
            <td>card_2</td>
            <td>6.0</td>
            <td>b, c</td>
          </tr>
          <tr>
            <td>card_3</td>
            <td>5.0</td>
            <td>a</td>
          </tr>
        </tbody>
      </table>
      <br />
      <p>
        Tag <strong>'b'</strong> will have an importance of 2.0 + 6.0 = 8.0. It
        will therefore appear first in the list of tags as <em>#b (2)</em>. The
        2 means that you have 2 cards that have 'b' as one of their tags. The
        hashtag is prepended because it's the conventional way of writing a tag.
        <br />
      </p>
    </>
  );
}

function UrgencyBars() {
  return (
    <>
      {SectionHeader({ id: "urgency_bars", text: "Urgency Bars" })}
      <p>
        The 4 urgency bars give you an idea of where the urgencies of the
        selected cards lie. Suppose you've chosen to review cards that have the
        tags #medium_programming_challenges and/or #dynamic_programming.
        <br />
        <br />
        Suppose there are 12 such cards and their urgencies are [3, 3, 3, 4, 6,
        6, 7, 8, 8, 8, 8, 9]. The urgencies of the 3rd, 6th, 9th and 12th cards
        are 3, 6, 8 and 9 respectively. The urgency bars will therefore be:
      </p>
      <div>
        <QuartilesBar quartiles={[0, 3, 6, 8, 9]} />
      </div>
      <br />
      <p>
        The bars also show you how you're using the provided range. For
        instance, if the urgency bars are like this...
      </p>
      <br />
      <br />
      <div>
        <QuartilesBar quartiles={[1, 3, 3.4, 3.8, 4]} />
      </div>
      <br />
      <p>... a few conclusions can be made:</p>
      <ul>
        <li>
          The most urgent card in this set has an urgency value of about 4.0
        </li>
        <li>
          There's not much separation in the urgency values of the upper half of
          the cards
        </li>
      </ul>
      <br />
      <p>
        The urgency bars should guide you when setting the urgency of any given
        card. If the bars are cramped together, you might want to space out the
        urgency values of those cards.
      </p>
    </>
  );
}

function ReviewMode() {
  return (
    <>
      {SectionHeader({ id: "review_mode", text: "Review Mode" })}
      <p>Normally, reviewing a set of cards works like this:</p>
      <ol>
        <li>
          Adjust the urgency of a card based on how confident you feel about its
          contents
        </li>
        <li>Click on the 'Save' button to store the changes</li>
        <li>Click on 'Next' to load the next card from the queue</li>
      </ol>
      <p>
        If review mode is active, {APP_NAME} makes the review process more
        convenient by pressing the 'Save' and 'Next' buttons on your behalf.
      </p>
    </>
  );
}

function publicVsPrivateCards() {
  return (
    <>
      <p>
        A private flashcard is only visible to you. It will not appear in the
        search results at <Link to={"/browse"}>/browse</Link>.
      </p>

      <p>
        In contrast, a public card will appear in the search results as a
        read-only card. Any user that wishes to add the card to their own
        collection will get a separate copy of the card.
      </p>

      <p>
        By default, your cards are private.
        <Link to={"/account"}>/account</Link> provides an option for setting the
        default from that point in time onwards.
      </p>

      <p>
        Please share your cards in order to benefit other users. Each card has a
        shareable link that you can send to others. Note that if the card is set
        to 'private', the link won't work.
      </p>

      <p>
        As a general guideline, the cards should have relevant titles and clear
        language. Where possible, credit your sources. If any of the cards in{" "}
        <Link to={"/browse"}>/browse</Link>
        are inappropriate or duplicates, please flag them as so.
      </p>
    </>
  );
}

export default function Wiki() {
  let sections = [
    TableOfContents(),
    FormattingCards(),
    TaggingAndUrgencySystem(),
    UrgencyBars(),
    ReviewMode(),
    publicVsPrivateCards(),
  ];
  let sectionsMarkup = sections.map((section, index) => (
    <div className="details_section" key={index}>
      {section}
    </div>
  ));
  return <div id="study_buddy_details">{sectionsMarkup}</div>;
}
