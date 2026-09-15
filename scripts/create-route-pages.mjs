import { mkdir, readFile, writeFile } from 'node:fs/promises'

const output = new URL('../dist/', import.meta.url)
const html = await readFile(new URL('index.html', output), 'utf8')

// Pages has no SPA rewrites, so each route needs an HTML entry.
for (const [route, title] of [['projects', 'Projects'], ['resume', 'Resume']]) {
  const directory = new URL(route + '/', output)
  const page = html.replace('<title>Ansh Jetli</title>', `<title>${title} | Ansh Jetli</title>`)
  await mkdir(directory, { recursive: true })
  await writeFile(new URL('index.html', directory), page)
  await writeFile(new URL(route + '.html', output), page)
}

await writeFile(new URL('404.html', output), html)
await writeFile(new URL('.nojekyll', output), '')
