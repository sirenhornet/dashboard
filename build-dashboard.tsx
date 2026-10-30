#!/usr/bin/env bun
import { renderToStaticMarkup } from "react-dom/server"

interface StatusItem {
  name: string
  status: string
}

interface JsonData {
  title: string
  timestamp: number
  status: StatusItem[]
}

const designs = ["plain", "card", "dark"]
const defaultDesign = "card"

const styles = `
body[data-design="card"] {
  margin: 0;
  padding: 2rem 1rem;
  background: #f1f5f9;
  color: #1e293b;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.5;
}
body[data-design="card"] .toolbar,
body[data-design="card"] section {
  max-width: 56rem;
  margin: 0 auto 1rem;
}
body[data-design="card"] .toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  color: #475569;
}
body[data-design="card"] .toolbar p {
  margin: 0;
}
body[data-design="card"] section {
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}
body[data-design="card"] h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}
body[data-design="card"] time {
  color: #64748b;
  font-size: 0.875rem;
}
body[data-design="card"] .elapsed {
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 600;
}
body[data-design="card"] ul {
  display: table;
  width: 100%;
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
  border-collapse: collapse;
}
body[data-design="card"] li {
  display: table-row;
}
body[data-design="card"] .status-name,
body[data-design="card"] .status-value {
  display: table-cell;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}
body[data-design="card"] .status-name {
  width: 1%;
  padding-left: 0;
  padding-right: 0.75rem;
  color: #475569;
  font-size: 0;
  font-weight: 600;
  white-space: nowrap;
}
body[data-design="card"] .status-name::before {
  content: attr(data-name);
  font-size: 1rem;
}
body[data-design="card"] .status-value {
  padding-left: 0;
  color: #0f172a;
}
body[data-design="card"] li:nth-child(even) {
  background: #f8fafc;
}
body[data-design="dark"] {
  margin: 0;
  padding: 2rem 1rem;
  background: #0f1115;
  color: #e2e8f0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  line-height: 1.6;
}
body[data-design="dark"] .toolbar,
body[data-design="dark"] section {
  max-width: 56rem;
  margin: 0 auto 1rem;
}
body[data-design="dark"] .toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  color: #94a3b8;
}
body[data-design="dark"] .toolbar p {
  margin: 0;
}
body[data-design="dark"] section {
  padding: 1.25rem 1.5rem;
  background: #181c23;
  border: 1px solid #2a303b;
  border-left: 4px solid #38bdf8;
  border-radius: 0.5rem;
}
body[data-design="dark"] h2 {
  margin: 0 0 0.5rem;
  color: #7dd3fc;
  font-size: 1.25rem;
}
body[data-design="dark"] time {
  color: #94a3b8;
  font-size: 0.875rem;
}
body[data-design="dark"] .elapsed {
  color: #fbbf24;
  font-size: 0.875rem;
  font-weight: 600;
}
body[data-design="dark"] ul {
  display: table;
  width: 100%;
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
  border-collapse: collapse;
}
body[data-design="dark"] li {
  display: table-row;
}
body[data-design="dark"] .status-name,
body[data-design="dark"] .status-value {
  display: table-cell;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #2a303b;
  text-align: left;
}
body[data-design="dark"] .status-name {
  width: 1%;
  padding-left: 0;
  padding-right: 0.75rem;
  color: #94a3b8;
  font-size: 0;
  font-weight: 600;
  white-space: nowrap;
}
body[data-design="dark"] .status-name::before {
  content: attr(data-name);
  font-size: 1rem;
}
body[data-design="dark"] .status-value {
  padding-left: 0;
  color: #e2e8f0;
}
body[data-design="dark"] li:nth-child(even) {
  background: #1e242e;
}
body[data-design="card"] select,
body[data-design="dark"] select {
  padding: 0.35rem 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #ffffff;
  color: inherit;
}
body[data-design="dark"] select {
  border-color: #334155;
  background: #1e293b;
}
`

const StatusItem = ({ item }: { item: StatusItem }) => (
  <li>
    <span className="status-name" data-name={item.name}>{item.name}:</span>
    <span className="status-value">{item.status}</span>
  </li>
)

const formatElapsed = (timestamp: number) => {
  const elapsedMs = Math.max(0, Date.now() - timestamp * 1000)
  const totalMinutes = Math.floor(elapsedMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

const StatusBlock = ({ data }: { data: JsonData }) => {
  const isoStr = new Date(data.timestamp * 1000).toISOString()
  return (
    <section>
      <h2>{data.title}</h2>
      <time dateTime={isoStr}>{isoStr}</time>{" "}
      <span className="elapsed" data-timestamp={data.timestamp}>({formatElapsed(data.timestamp)} ago)</span>
      <ul>
        {data.status.map((item, i) => (
          <StatusItem key={i} item={item} />
        ))}
      </ul>
    </section>
  )
}

const clientScript = `(() => {
  const body = document.body
  const select = document.getElementById("design-switcher")
  if (select) {
    select.value = body.dataset.design || "${defaultDesign}"
    select.addEventListener("change", () => {
      body.dataset.design = select.value
    })
  }
  const now = new Date()
  const iso = now.toISOString()
  const displayed = document.getElementById("displayed-at")
  if (displayed) {
    displayed.textContent = iso
    displayed.setAttribute("datetime", iso)
  }
  document.querySelectorAll(".elapsed").forEach((el) => {
    const timestamp = Number(el.getAttribute("data-timestamp")) * 1000
    const minutes = Math.floor(Math.max(0, now.getTime() - timestamp) / 60000)
    el.textContent = \`(\${Math.floor(minutes / 60)}h \${minutes % 60}m ago)\`
  })
})()`

const StatusApp = ({ items }: { items: JsonData[] }) => {
  const nowIso = new Date().toISOString()
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Status</title>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body data-design={defaultDesign}>
        <header className="toolbar">
          <p>
            Displayed at: <time id="displayed-at" dateTime={nowIso}>{nowIso}</time>
          </p>
          <label>
            Design:{" "}
            <select id="design-switcher" defaultValue={defaultDesign}>
              {designs.map((design) => (
                <option key={design} value={design}>
                  {design}
                </option>
              ))}
            </select>
          </label>
        </header>
        {items.map((data, index) => (
          <StatusBlock key={index} data={data} />
        ))}
        <script dangerouslySetInnerHTML={{ __html: clientScript }} />
      </body>
    </html>
  )
}

const formatHtml = (html: string) => {
  const tokens = html.match(/(<\/?[^>]+>|[^<]+)/g) || []
  let indent = 0
  let result = ""

  for (const token of tokens) {
    if (token.startsWith("</")) {
      indent = Math.max(0, indent - 2)
      result += "\n" + " ".repeat(indent) + token
    } else if (token.startsWith("<") && (token.endsWith("/>") || token.startsWith("<!"))) {
      result += "\n" + " ".repeat(indent) + token
    } else if (token.startsWith("<")) {
      result += "\n" + " ".repeat(indent) + token
      indent += 2
    } else {
      const trimmed = token.trim()
      if (trimmed) {
        result += "\n" + " ".repeat(indent) + trimmed
      }
    }
  }

  return result.trim()
}

const main = async () => {
  const files = Bun.argv.slice(2)
  const allData: JsonData[] = []

  for (const filePath of files) {
    const file = Bun.file(filePath)
    if (await file.exists()) {
      const data = await file.json() as JsonData
      allData.push(data)
    }
  }

  const rawHtml = "<!DOCTYPE html>\n" + renderToStaticMarkup(<StatusApp items={allData} />)
  const formattedHtml = formatHtml(rawHtml)
  process.stdout.write(formattedHtml + "\n")
}

main()
