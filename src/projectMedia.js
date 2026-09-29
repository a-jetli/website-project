const files = import.meta.glob('./assets/projects/*/*.{avif,gif,jpeg,jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const mediaByProject = {}

for (const [path, src] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))) {
  const [, projectId, filename] = path.match(/\.\/assets\/projects\/([^/]+)\/([^/]+)$/)
  const label = filename.replace(/\.[^.]+$/, '').replace(/^\d+[-_. ]*/, '').replace(/[-_]+/g, ' ').trim()
  mediaByProject[projectId] ??= []
  mediaByProject[projectId].push({ src, label: label || `Image ${mediaByProject[projectId].length + 1}` })
}

export function getProjectMedia(projectId) {
  return mediaByProject[projectId] ?? []
}
