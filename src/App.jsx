import { useEffect, useRef, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router'
import './App.css'
import HomePage from './HomePage.jsx'
import ProjectsPage from './ProjectsPage.jsx'
import ResumePage from './ResumePage.jsx'
import SocialLinks from './SocialLinks.jsx'
import ThemeControls from './ThemeControls.jsx'
import BackgroundEffects from './BackgroundEffects.jsx'
import EmailDialog from './EmailDialog.jsx'
import { readPreference, writePreference } from './preferences.js'
import { colorFields, defaultGradientStrength, extraThemes, gradientFields, surfaceFields } from './themeColors.js'

function midpointHex(first, second) {
  return '#' + [1, 3, 5].map((index) => {
    const a = parseInt(first.slice(index, index + 2), 16)
    const b = parseInt(second.slice(index, index + 2), 16)
    return Math.round((a + b) / 2).toString(16).padStart(2, '0')
  }).join('')
}

function hasSavedCustomTheme() {
  return surfaceFields.some(({ name }) => readPreference('custom' + name, null) !== null)
}

function Sidebar({ onEmailClick, theme, onThemeChange, customColors, onCustomColorsChange, customStrength, onCustomStrengthChange, backgroundEnabled, onBackgroundChange, glowEnabled, onGlowChange, grainEnabled, onGrainChange, driftEnabled, onDriftChange }) {
  return (
    <aside className="left-panel" aria-label="Profile and navigation">
      <img className="photo" src="/header_photo.jpg" alt="Ansh Jetli" />
      <div className="identity">
        <p className="name">Ansh Jetli</p>
        <p className="occupation">CS Student @ Rutgers New Brunswick</p>
      </div>
      <div className="nav-footer">
        <nav aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/resume">Resume</NavLink>
        </nav>
        <SocialLinks onEmailClick={onEmailClick} />
        <ThemeControls theme={theme} onThemeChange={onThemeChange}
          customColors={customColors} onCustomColorsChange={onCustomColorsChange}
          customStrength={customStrength} onCustomStrengthChange={onCustomStrengthChange}
          backgroundEnabled={backgroundEnabled} onBackgroundChange={onBackgroundChange}
          glowEnabled={glowEnabled} onGlowChange={onGlowChange}
          grainEnabled={grainEnabled} onGrainChange={onGrainChange}
          driftEnabled={driftEnabled} onDriftChange={onDriftChange} />
      </div>
    </aside>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const page = pathname.replace(/\/$/, '')
  const emailDialogRef = useRef(null)
  const [theme, setTheme] = useState(() => {
    const saved = readPreference('theme', 'dark')
    const selected = saved === 'wisteria' ? 'lavender' : saved
    return ['light', 'dark', ...extraThemes.map(({ value }) => value), 'custom'].includes(selected) ? selected : 'dark'
  })
  const [glowEnabled, setGlowEnabled] = useState(() => readPreference('glow', 'true') !== 'false')
  const [backgroundEnabled, setBackgroundEnabled] = useState(() => readPreference('background', 'true') !== 'false')
  const [grainEnabled, setGrainEnabled] = useState(() => readPreference('grain', readPreference('glow', 'true')) !== 'false')
  const [driftEnabled, setDriftEnabled] = useState(() => readPreference('drift', 'true') !== 'false')
  const [customColors, setCustomColors] = useState(() => {
    const savedSurface = Object.fromEntries(surfaceFields.map(({ name, defaultValue }) => {
      const saved = readPreference('custom' + name, defaultValue)
      return [name, /^#[0-9a-f]{6}$/i.test(saved) ? saved : defaultValue]
    }))
    const legacyGradient = hasSavedCustomTheme() ? {
      '--wash-1': savedSurface['--accent'],
      '--wash-2': midpointHex(savedSurface['--accent'], savedSurface['--bg-subtle']),
      '--wash-3': savedSurface['--bg-subtle'],
    } : {}
    const savedGradient = Object.fromEntries(gradientFields.map(({ name, defaultValue }) => {
      const fallback = legacyGradient[name] ?? defaultValue
      const saved = readPreference('custom' + name, fallback)
      return [name, /^#[0-9a-f]{6}$/i.test(saved) ? saved : fallback]
    }))
    return { ...savedSurface, ...savedGradient }
  })
  const [customStrength, setCustomStrength] = useState(() => {
    const fallback = hasSavedCustomTheme() ? 35 : defaultGradientStrength
    const saved = Number(readPreference('custom--wash-tint', String(fallback)))
    return Number.isFinite(saved) && saved >= 0 && saved <= 100 ? saved : fallback
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    writePreference('theme', theme)
    for (const { name } of colorFields) {
      if (theme === 'custom') {
        root.style.setProperty(name, customColors[name])
        writePreference('custom' + name, customColors[name])
      } else {
        root.style.removeProperty(name)
      }
    }
    if (theme === 'custom') {
      root.style.setProperty('--wash-tint', `${customStrength}%`)
      writePreference('custom--wash-tint', String(customStrength))
    } else {
      root.style.removeProperty('--wash-tint')
    }
  }, [theme, customColors, customStrength])

  useEffect(() => {
    writePreference('background', String(backgroundEnabled))
  }, [backgroundEnabled])

  useEffect(() => {
    writePreference('glow', String(glowEnabled))
  }, [glowEnabled])

  useEffect(() => {
    writePreference('grain', String(grainEnabled))
  }, [grainEnabled])

  useEffect(() => {
    writePreference('drift', String(driftEnabled))
  }, [driftEnabled])

  useEffect(() => {
    document.title = page === '/projects' ? 'Projects | Ansh Jetli'
      : page === '/resume' ? 'Resume | Ansh Jetli'
      : page === '' ? 'Ansh Jetli' : 'Page not found | Ansh Jetli'
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [page, pathname])

  function openEmailDialog() {
    emailDialogRef.current.showModal()
  }

  return (
    <>
      <BackgroundEffects backgroundEnabled={backgroundEnabled} glowEnabled={glowEnabled} grainEnabled={grainEnabled} driftEnabled={driftEnabled} />
      <div className="layout">
        <Sidebar onEmailClick={openEmailDialog} theme={theme} onThemeChange={setTheme}
          customColors={customColors} onCustomColorsChange={setCustomColors}
          customStrength={customStrength} onCustomStrengthChange={setCustomStrength}
          backgroundEnabled={backgroundEnabled} onBackgroundChange={setBackgroundEnabled}
          glowEnabled={glowEnabled} onGlowChange={setGlowEnabled}
          grainEnabled={grainEnabled} onGrainChange={setGrainEnabled}
          driftEnabled={driftEnabled} onDriftChange={setDriftEnabled} />
        <main className={`right-panel content${page === '/projects' ? ' right-panel--projects' : ''}`} key={pathname}>
          <Routes>
            <Route path="/" element={<HomePage onEmailClick={openEmailDialog} />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="/projects.html" element={<Navigate to="/projects" replace />} />
            <Route path="/resume.html" element={<Navigate to="/resume" replace />} />
            <Route path="*" element={<h1 className="bio-heading">Page not found</h1>} />
          </Routes>
        </main>
      </div>
      <EmailDialog dialogRef={emailDialogRef} />
      <footer><p>Designed &amp; built by Ansh Jetli · 2026</p></footer>
    </>
  )
}
