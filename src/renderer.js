import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlines(inlines) {
  if (!inlines) return "";
  return inlines
    .map((tok) => {
      if (!tok) return "";
      switch (tok.type) {
        case "text":
          return escapeHtml(tok.value);
        case "inlineCode":
          return `<code class=\"inline-code\">${escapeHtml(tok.value)}</code>`;
        case "strong":
          return `<strong>${renderInlines(tok.children || [])}</strong>`;
        case "emphasis":
          return `<em>${renderInlines(tok.children || [])}</em>`;
        case "link":
          return `<a href=\"${escapeHtml(
            tok.url
          )}\" target=\"_blank\" rel=\"noopener noreferrer\">${renderInlines(
            tok.children || []
          )}</a>`;
        case "image":
          return `<img class=\"inline-img\" src=\"${escapeHtml(
            tok.url
          )}\" alt=\"${escapeHtml(tok.alt)}\" />`;
        default:
          return "";
      }
    })
    .join("");
}

function renderBlock(block) {
  if (!block) return "";

  switch (block.type) {
    case "heading": {
      const level = Math.min(Math.max(block.level || 1, 1), 6);
      const inner = block.inlines
        ? renderInlines(block.inlines)
        : escapeHtml(block.content || "");
      return `<h${level}>${inner}</h${level}>`;
    }
    case "paragraph": {
      if (block.inlines) return `<p>${renderInlines(block.inlines)}</p>`;
      return `<p>${escapeHtml(block.content || "")}</p>`;
    }
    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      const items = (block.items || [])
        .map((it) => {
          if (typeof it === "string") return `<li>${escapeHtml(it)}</li>`;
          if (it.inlines) return `<li>${renderInlines(it.inlines)}</li>`;
          return `<li>${escapeHtml(it.content || "")}</li>`;
        })
        .join("\n");
      return `<${tag}>\n${items}\n</${tag}>`;
    }
    case "code": {
      const langClass = block.language
        ? `language-${escapeHtml(block.language)}`
        : "";
      const code = escapeHtml(block.content || "");
      return `<pre><code class=\"${langClass}\">${code}</code></pre>`;
    }
    case "quote": {
      if (block.inlines)
        return `<blockquote>${renderInlines(block.inlines)}</blockquote>`;
      return `<blockquote>${escapeHtml(block.content || "")}</blockquote>`;
    }
    case "image": {
      return `<div class=\"img-wrap\"><img src=\"${escapeHtml(
        block.url
      )}\" alt=\"${escapeHtml(block.alt)}\"/></div>`;
    }
    case "link": {
      const inner = block.inlines
        ? renderInlines(block.inlines)
        : escapeHtml(block.text || "");
      return `<p><a href=\"${escapeHtml(
        block.url
      )}\" target=\"_blank\" rel=\"noopener noreferrer\">${inner}</a></p>`;
    }
    case "table": {
      const header = (block.header || [])
        .map((h) => `<th>${escapeHtml(h)}</th>`)
        .join("");
      const rows = (block.rows || [])
        .map(
          (r) =>
            `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`
        )
        .join("\n");
      return `<table class=\"table\"><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`;
    }
    default:
      return `<pre>${escapeHtml(JSON.stringify(block, null, 2))}</pre>`;
  }
}

function buildHTML(bodyContent) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>MarkCard Preview</title>
  <style>
    :root{
      --bg:#0f1724;--card:#0b1220;--muted:#94a3b8;--accent:#7c3aed;--text:#e6eef8;
      --gap:16px; --max-width:1000px;
    }
    html,body{height:100%}
    body{margin:0;background:linear-gradient(180deg,#081024 0%,#071022 100%);color:var(--text);font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;line-height:1.4;-webkit-font-smoothing:antialiased}
    .wrap{max-width:var(--max-width);margin:24px auto;padding:16px;box-sizing:border-box}
    .card{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.04);border-radius:12px;padding:18px;margin:12px 0;box-shadow:0 6px 20px rgba(2,6,23,0.6)}
    h1{font-size:1.6rem;margin:.25rem 0}
    h2{font-size:1.15rem;margin:.4rem 0}
    h3{font-size:1rem}
    p{color:var(--muted);margin:.6rem 0}
    pre{background:#021026;padding:12px;border-radius:8px;overflow:auto;color:#dbeafe;position:relative;margin:.75rem 0}
    code.inline-code{background:rgba(255,255,255,0.03);padding:2px 6px;border-radius:6px;color:#ffd;font-size:.95em} 
    .img-wrap{display:flex;justify-content:center;margin:12px 0}
    .img-wrap img{max-width:100%;height:auto;border-radius:8px;border:1px solid rgba(255,255,255,0.03)}
    table.table{width:100%;border-collapse:collapse;margin:12px 0;font-size:.95rem}
    table.table th, table.table td{border:1px solid rgba(255,255,255,0.04);padding:8px;text-align:left}
    a{color:var(--accent);word-break:break-all}
    ul,ol{color:var(--muted);padding-left:1.2rem}
    .copy-btn{position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.35);border:0;color:var(--text);padding:8px 10px;border-radius:8px;cursor:pointer;font-size:.9rem}
    .copy-btn:active{transform:translateY(1px)}
    .copy-msg{position:absolute;top:8px;right:84px;background:#111827;color:#fff;padding:6px 8px;border-radius:6px;font-size:13px;display:none}

    /* Mobile friendliness */
    @media (max-width: 640px) {
      .wrap{margin:16px;padding:12px}
      .card{padding:14px;border-radius:10px}
      h1{font-size:1.25rem}
      h2{font-size:1.05rem}
      pre{font-size:.9rem}
      .copy-btn{padding:10px 12px;right:6px;top:6px;border-radius:10px}
      .copy-msg{right:68px;font-size:12px}
      table.table th, table.table td{padding:6px;font-size:.9rem}
      code.inline-code{font-size:0.92em}
    }

    /* Make long code blocks wrap nicer on small screens */
    pre code{white-space:pre-wrap;word-break:break-word}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>MarkCard Preview</h1>
    ${bodyContent}
  </div>
  <script>
    // Add copy buttons to all code blocks
    (function(){
      function createBtn(){
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.type = 'button';
        btn.textContent = 'Copy';
        return btn;
      }
      function createMsg(){
        const s = document.createElement('div');
        s.className = 'copy-msg';
        s.textContent = 'Copied!';
        return s;
      }
      document.querySelectorAll('pre > code').forEach((code) => {
        const pre = code.parentNode;
        pre.style.position = 'relative';
        const btn = createBtn();
        const msg = createMsg();
        pre.appendChild(btn);
        pre.appendChild(msg);
        btn.addEventListener('click', async () => {
          try{
            await navigator.clipboard.writeText(code.textContent);
            msg.style.display = 'block';
            setTimeout(()=> msg.style.display = 'none', 1500);
          }catch(e){
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = code.textContent;
            document.body.appendChild(ta);
            ta.select();
            try{document.execCommand('copy'); msg.style.display='block'; setTimeout(()=> msg.style.display = 'none',1500);}catch(err){}
            document.body.removeChild(ta);
          }
        });
      });
    })();
  </script>
</body>
</html>`;
}

export function renderJsonToHtml(json) {
  const cards = json.cards || [];
  const htmlCards = cards
    .map((card) => {
      const blocks = (card.blocks || []).flatMap((b) =>
        Array.isArray(b) ? b : [b]
      );
      const inner = blocks.map(renderBlock).join("\n");
      return `<section class=\"card\"><div class=\"card-inner\">${inner}</div></section>`;
    })
    .join("\n");
  return buildHTML(htmlCards);
}

export function renderFile(jsonPath, outHtmlPath) {
  const json = JSON.parse(
    readFileSync(resolve(process.cwd(), jsonPath), "utf-8")
  );
  const html = renderJsonToHtml(json);
  writeFileSync(resolve(process.cwd(), outHtmlPath), html, "utf-8");
  return outHtmlPath;
}

export default { renderJsonToHtml, renderFile };
