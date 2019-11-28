import { sanitizeCard, sanitizeQuery } from "./SanitizationAndValidation";
import { INewFlashCard } from "./DBModels";

describe("SanitizationAndValidation", function() {

    describe("SanitizeCard", function() {
        // HTML adapted from https://www.codeproject.com/Articles/879381/Rule-based-HTML-sanitizer
        const XSS_ONCLICK = `onclick="alert('gotcha!')"`;
        const XSS_SCRIPT = `<script type="text/javascript">console.log('seriously?')</script>`;
        const XSS_HREF = `<a href="javascript:alert('test')">Obviously I'm illegal</a>`;
        const dirtyCard: INewFlashCard = {
            title: `<p ${XSS_ONCLICK}>Some comments<span></span></p>`,
            rawDescription: `<h1>Heading</h1>
                <p ${XSS_ONCLICK}>Some comments<span></span></p>${XSS_SCRIPT}
                <p><a href="http://www.google.com/">Nofollow legal link</a> 
                and here's another one:${XSS_HREF}</p>`,
            tags: ["<script>alert('ok')</script>", "valid_tag"],
            urgency: 10, 
            isPublic: true,
            ownerId: "random-id-2367367236723", 
            parentId: `${XSS_ONCLICK}`
        };

        it("should sanitize dangerous tags", function(done) {
            let sanitizedCard = sanitizeCard(dirtyCard);
            console.log(sanitizedCard);
            done();
        });
    });

    describe("sanitizeQuery", function() {
        // Same as sanitize cards, e.g. filter malicious input.

        it("should strip attributes with wrong types.", function() {
            throw new Error("Test not implemented yet.");
        });
    });
});