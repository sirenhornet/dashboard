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

const StatusItem = ({ item }: { item: StatusItem }) => (
  <li>{item.name}: {item.status}</li>
)

const StatusBlock = ({ data }: { data: JsonData }) => {
  const isoStr = new Date(data.timestamp * 1000).toISOString()
  return (
    <section>
      <h2>{data.title}</h2>
      <time dateTime={isoStr}>{isoStr}</time>
      <ul>
        {data.status.map((item, i) => (
          <StatusItem key={i} item={item} />
        ))}
      </ul>
    </section>
  )
}

const StatusApp = ({ items }: { items: JsonData[] }) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <title>Status</title>
    </head>
    <body>
      {items.map((data, index) => (
        <StatusBlock key={index} data={data} />
      ))}
    </body>
  </html>
)

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
