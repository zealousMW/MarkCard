import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { readFileSync, writeFileSync } from "fs";
import { inspect } from "util";

// Inline/extraction utilities
function extractInlines(node) {
  if (!node) return [];
  if (Array.isArray(node)) return node.flatMap(extractInlines);
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
      return [{ type: "image", url: node.url || null, alt: node.alt || "" }];
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
        case "emphasis":
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
      const inlines = extractInlines(node);
      const blocks = [];
      let acc = [];
      function pushAcc() {
        if (acc.length > 0) {
          blocks.push({
            type: "paragraph",
            inlines: acc,
            content: inlinesToString(acc),
          });
          acc = [];
        }
      }
      for (const tok of inlines) {
        if (tok.type === "image") {
          pushAcc();
          blocks.push({ type: "image", url: tok.url, alt: tok.alt });
        } else acc.push(tok);
      }
      pushAcc();
      if (blocks.length === 1) return blocks[0];
      return blocks;
    }
    case "list":
      return {
        type: "list",
        ordered: node.ordered || false,
        items: node.children.map((listItem) => {
          const inlines = extractInlines(listItem);
          return { content: inlinesToString(inlines), inlines };
        }),
      };
    case "code":
      return {
        type: "code",
        language: node.lang || null,
        content:
          typeof node.value === "string"
            ? node.value.replace(/\r\n/g, "\n")
            : node.value,
      };
    case "blockquote":
      return {
        type: "quote",
        inlines: extractInlines(node),
        content: inlinesToString(extractInlines(node)),
      };
    case "image":
      return { type: "image", url: node.url || null, alt: node.alt || "" };
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
          ? node.children[0].children.map((cell) =>
              inlinesToString(extractInlines(cell))
            )
          : [],
        rows: node.children
          .slice(1)
          .map((row) =>
            row.children.map((cell) => inlinesToString(extractInlines(cell)))
          ),
      };
    default:
      return null;
  }
}

export function parseMarkdownToJson(markdown) {
  const processor = unified().use(remarkParse).use(remarkGfm);
  const ast = processor.parse(markdown);

  const cards = [];
  let currentCard = [];
  for (const node of ast.children) {
    const isDelimiter =
      node.type === "heading" &&
      node.children &&
      node.children.length === 1 &&
      node.children[0].type === "text" &&
      node.children[0].value.trim() === "c-a-r-d";
    if (isDelimiter) {
      if (currentCard.length > 0) cards.push(currentCard);
      currentCard = [];
    } else currentCard.push(node);
  }
  if (currentCard.length > 0) cards.push(currentCard);

  const finalJson = {
    cards: cards.map((nodes, index) => ({
      id: `card-${index + 1}`,
      blocks: nodes
        .map(transformNode)
        .flat()
        .filter((n) => n !== null),
    })),
  };
  return finalJson;
}

export function parseFileToJson(inputFile, outputFile) {
  const content = readFileSync(inputFile, "utf-8");
  const json = parseMarkdownToJson(content);
  if (outputFile)
    writeFileSync(outputFile, JSON.stringify(json, null, 2), "utf-8");
  return json;
}

export default { parseMarkdownToJson, parseFileToJson };
