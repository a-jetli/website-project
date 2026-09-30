export const extraThemes = [
  { value: 'lavender', label: 'Lavender' },
  { value: 'earthy', label: 'Earthy' },
  { value: 'meadow', label: 'Meadow' },
  { value: 'stormy', label: 'Storm' },
]

export const siteColorFields = [
  { name: '--bg', label: 'Page background', defaultValue: '#0d0f14' },
  { name: '--bg-subtle', label: 'Panels & cards', defaultValue: '#1e2435' },
  { name: '--text', label: 'Body text', defaultValue: '#bcc2cd' },
  { name: '--text-muted', label: 'Headings & labels', defaultValue: '#98a0af' },
  { name: '--accent', label: 'Links & accents', defaultValue: '#6ba7f5' },
  { name: '--border', label: 'Lines & borders', defaultValue: '#252a38' },
]

export const backgroundColorFields = [
  { name: '--wash-1', label: 'First color', defaultValue: '#3f6fa8' },
  { name: '--wash-2', label: 'Second color', defaultValue: '#2d5566' },
  { name: '--wash-3', label: 'Third color', defaultValue: '#16213a' },
]

export const colorFields = [...siteColorFields, ...backgroundColorFields]
