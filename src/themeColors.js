export const extraThemes = [
  { value: 'lavender', label: 'Lavender' },
  { value: 'earthy', label: 'Earthy' },
  { value: 'meadow', label: 'Meadow' },
  { value: 'stormy', label: 'Storm' },
]

export const surfaceFields = [
  { name: '--bg', label: 'Page background', defaultValue: '#0d0f14' },
  { name: '--bg-subtle', label: 'Panels and cards', defaultValue: '#1e2435' },
  { name: '--text', label: 'Body text', defaultValue: '#bcc2cd' },
  { name: '--text-muted', label: 'Muted text', defaultValue: '#8b93a1' },
  { name: '--accent', label: 'Links and accents', defaultValue: '#6ba7f5' },
  { name: '--border', label: 'Lines & borders', defaultValue: '#252a38' },
]

export const gradientFields = [
  { name: '--wash-1', label: 'Color 1', defaultValue: '#315b8c' },
  { name: '--wash-2', label: 'Color 2', defaultValue: '#65457f' },
  { name: '--wash-3', label: 'Color 3', defaultValue: '#152539' },
]

export const colorFields = [...surfaceFields, ...gradientFields]
export const defaultGradientStrength = 65
