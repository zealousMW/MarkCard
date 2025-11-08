MarkCard

Tagline: From Markdown to a Universal Content Format.

MarkCard is a content pipeline tool that transforms author-friendly Markdown into application-ready JSON. It creates a build step for your content, enabling a true "write once, render anywhere" architecture.

## The Problem: Markdown is Not an Application Format

Markdown is the undisputed standard for writing. It's simple, clean, and human-readable. However, for an application, a raw .md file is just a string of text. It has no inherent structure that a program can easily understand.

This forces a difficult choice:

Parse on the Client: Bundle a Markdown parser in your web app, your iOS app, AND your Android app. This increases bundle sizes, duplicates logic, and risks rendering inconsistencies across platforms.

Use a WebView: Render the content in a web view inside your mobile app, sacrificing native performance and user experience.

Both are compromises.

## The Solution: A JSON-First Content Pipeline

MarkCard solves this problem by treating your content like code. It introduces a build step that parses your Markdown once into a clean, structured, and universal JSON format.

This JSON becomes your single source of truth. It's a predictable data structure that any application can trivially understand.

This architecture gives you immense power:

- Render Natively Everywhere: Your applications consume the same JSON.
  - Your Web App (React, Vue) maps the JSON blocks to HTML tags (<div>, <h2>, <p>).
  - Your iOS App (SwiftUI) maps them to native views (VStack, Text, Image).
  - Your Android App (Jetpack Compose) maps them to native composables (Column, Text, Image).

The result is a perfect, native user experience on every platform, powered by the exact same source content.

- Decouple Content from Presentation: The content (JSON) is completely separate from the view layer. You can redesign your entire app's UI without ever touching the source Markdown.
- Guarantee Consistency: Because every platform consumes the same structured data, you eliminate the risk of parsing quirks or rendering differences.
- Make Content Queryable: Your content is now data. You can programmatically analyze it, transform it, or feed it into other systems without wrestling with string parsing.

MarkCard gives you this powerful JSON format and, for convenience, a beautiful HTML preview renderer so you can validate your content instantly.

## Features

- Universal JSON Output: The primary artifact is a clean, easy-to-parse JSON file designed for multi-platform consumption.
- Standalone HTML Preview: Generate a polished, single-file HTML preview with a dark-mode theme and interactive copy buttons for code blocks.
- Rich Content Support: Preserves inline formatting (bold, italic, links), images, GFM tables, and code blocks.
- Modular CLI: A clean command-line interface with separate parse and render commands to fit into any workflow.

## Quick Start

Install Dependencies

```bash
npm install
```

Run the Build Command

```bash
# Usage: node src/index.js build <inputFile> -j <outputJson> -o <outputHtml>
node src/index.js build input/sample.md -j output/content.json -o output/preview.html
```

Inspect the Output

`output/content.json` contains the structured data for your applications.

`output/preview.html` is the human-readable preview.

## How Content is Chunked

To segment a long Markdown document, MarkCard treats any heading (e.g., #, ##) containing exactly the text `c-a-r-d` as a separator. The content between these delimiters becomes a distinct object in the cards array in the final JSON.

(See <attachments> above for file contents. You may not need to search or read the file again.)
