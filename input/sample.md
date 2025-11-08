# MarkCard — Single Big Card Example

This single card contains many block types so you can see how the parser and renderer handle a dense, content-rich card. It includes inline formatting, lists, quotes, tables, multiple code blocks (JS + Python), links, images, and a final notes section.

- Quick start
- Keep cards short when possible
- Use clear headings to break sections

## Inline formatting & link

You can include inline code like `npm install markcard` and emphasize text with **bold** or *italic* styles. Here's a helpful link: [MarkCard repo](https://example.org).

> Note: blockquotes should be captured as quote blocks in the JSON.

## Ordered steps

1. Initialize the project
2. Add your markdown cards
3. Run the parser and renderer

## Code: JavaScript (copyable)

The following JS snippet demonstrates a utility function and should be copyable from the HTML preview.

```javascript
// small JS helper: add and log
export function add(a, b) {
  const sum = a + b;
  console.log(`sum: ${sum}`);
  return sum;
}

// usage
add(2, 3);
```

## Code: Python (copyable)

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Mark")
```

## Image

Here is an example image (relative path):

![example image](./assets/example.png)

## Table

| Name | Description |
| --- | --- |
| alpha | first item |
| beta | second item |

## Final notes

This is the end of the single large card. Add more content here to test long cards, multiple code blocks, and media.

