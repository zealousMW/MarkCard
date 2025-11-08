import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { readFileSync, writeFileSync } from "fs";
import { inspect } from "util";

import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

// Extract inline tokens so we can preserve formatting (strong, emphasis, inlineCode, links, images)
function extractInlines(node) {
  if (!node) return [];

  if (Array.isArray(node)) {
    return node.flatMap(extractInlines);
  }

  switch (node.type) {
    case "text":
      return [{ type: "text", value: node.value || "" }];
    case "inlineCode":
      return [{ type: "inlineCode", value: node.value }];
    case "strong":
      return [{ type: "strong", children: extractInlines(node.children) }];
    case "emphasis":
      return [{ type: "emphasis", children: extractInlines(node.children) }];
    case "link":
      return [
        {
          type: "link",
          url: node.url || null,
          children: extractInlines(node.children),
        },
      ];
    case "image":
      return [
        {
          type: "image",
          url: node.url || null,
          alt: node.alt || "",
        },
      ];
    default:
      if (node.children) return extractInlines(node.children);
      return [];
  }
}

function inlinesToString(inlines) {
  return (inlines || [])
    .map((tok) => {
      switch (tok.type) {
        case "text":
          return tok.value;
        case "inlineCode":
          return `\`${tok.value}\``;
        case "strong":
          return inlinesToString(tok.children || []);
        case "emphasis":
          return inlinesToString(tok.children || []);
        case "link":
          return inlinesToString(tok.children || []);
        case "image":
          return tok.alt || "";
        default:
          return "";
      }
    })
    .join("");
}

function transformNode(node) {
  switch (node.type) {
    case "heading": {
      const inlines = extractInlines(node);
      return {
        type: "heading",
        level: node.depth,
        inlines,
        content: inlinesToString(inlines),
      };
    }
    case "paragraph": {
      // Emit paragraph blocks and image blocks if images are inline
      const inlines = extractInlines(node);

      const blocks = [];
      let acc = [];

      function pushAcc() {
        if (acc.length > 0) {
          blocks.push({ type: "paragraph", inlines: acc, content: inlinesToString(acc) });
          acc = [];
        }
      }

      for (const tok of inlines) {
        if (tok.type === "image") {
          pushAcc();
          blocks.push({ type: "image", url: tok.url, alt: tok.alt });
        } else {
          acc.push(tok);
        }
      }
      pushAcc();

      if (blocks.length === 1) return blocks[0];
      return blocks;
    }
    case "list":
      return {
        type: "list",
        ordered: node.ordered || false,
        // represent each item with both a string and inline tokens
        items: node.children.map((listItem) => {
          const inlines = extractInlines(listItem);
          return { content: inlinesToString(inlines), inlines };
        }),
      };
    case "code":
      return {
        type: "code",
        language: node.lang || null,
        // normalize CRLF to LF for consistency across platforms
        content: typeof node.value === "string" ? node.value.replace(/\r\n/g, "\n") : node.value,
      };
    case "blockquote":
      return {
        type: "quote",
        inlines: extractInlines(node),
        content: inlinesToString(extractInlines(node)),
      };
    case "image":
      return {
        type: "image",
        url: node.url || null,
        alt: node.alt || "",
      };
    case "link":
      return {
        type: "link",
        url: node.url || null,
        text: inlinesToString(extractInlines(node)),
        inlines: extractInlines(node),
      };
    case "table":
      return {
        type: "table",
        header: node.children[0]
          ? node.children[0].children.map((cell) => inlinesToString(extractInlines(cell)))
          : [],
        rows: node.children.slice(1).map((row) => row.children.map((cell) => inlinesToString(extractInlines(cell)))),
      };
    default:
      return null;
  }
}

const inputFile = "input/sample.md";
const fileContent = readFileSync(inputFile, "utf-8");

// Use remark-parse + remark-gfm so GFM features (tables, task lists, strikethrough)
// are recognized as proper AST nodes instead of plain paragraphs.
const processor = unified().use(remarkParse).use(remarkGfm);
const ast = processor.parse(fileContent);

const cards = [];
let currentCard = [];

for (const node of ast.children) {
  console.log(`Processing node of type: ${node.type}`);
  const isDelimiter =
    node.type === "heading" &&
    node.children.length === 1 &&
    node.children[0].type === "text" &&
    node.children[0].value.trim() === "c-a-r-d";

  if (isDelimiter) {
    if (currentCard.length > 0) {
      cards.push(currentCard);
      console.log(`Card delimiter found. Current card pushed. Total cards: ${cards.length}`);
    }
    currentCard = [];
  } else {
    currentCard.push(node);
  }
}

if (currentCard.length > 0) {
  cards.push(currentCard);
}

console.log(`Found ${cards.length} cards.`);
console.log("cards:", inspect(cards[0], { depth: null, colors: true }));

const finalJson = {
  cards: cards.map((nodes, index) => ({
    id: `card-${index + 1}`,
    blocks: nodes.map(transformNode).filter((n) => n !== null),
  })),
};

writeFileSync("output/cards.json", JSON.stringify(finalJson, null, 2), "utf-8");
console.log("Transformed cards written to output/cards.json");

console.log(JSON.stringify(finalJson, null, 2));