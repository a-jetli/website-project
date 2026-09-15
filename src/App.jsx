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
import { colorFields, extraThemes } from './themeColors.js'

function Sidebar({ onEmailClick, theme, onThemeChange, customColors, onCustomColorsChange, glowEnabled, onGlowChange, grainEnabled, onGrainChange, driftEnabled, onDriftChange, flickerEnabled, onFlickerChange }) {
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
          glowEnabled={glowEnabled} onGlowChange={onGlowChange}
          grainEnabled={grainEnabled} onGrainChange={onGrainChange}
          driftEnabled={driftEnabled} onDriftChange={onDriftChange}
          flickerEnabled={flickerEnabled} onFlickerChange={onFlickerChange} />
      </div>
    </aside>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const emailDialogRef = useRef(null)
  const [theme, setTheme] = useState(() => {
    const saved = readPreference('theme', 'dark')
    const selected = saved === 'wisteria' ? 'lavender' : saved
    return ['light', 'dark', ...extraThemes.map(({ value }) => value), 'custom'].includes(selected) ? selected : 'dark'
  })
  const [glowEnabled, setGlowEnabled] = useState(() => readPreference('glow', 'true') !== 'false')
  const [grainEnabled, setGrainEnabled] = useState(() => readPreference('grain', readPreference('glow', 'true')) !== 'false')
  const [driftEnabled, setDriftEnabled] = useState(() => readPreference('drift', 'true') !== 'false')
  const [flickerEnabled, setFlickerEnabled] = useState(() => readPreference('flicker', 'true') !== 'false')
  const [customColors, setCustomColors] = useState(() => Object.fromEntries(
    colorFields.map(({ name, defaultValue }) => {
      const saved = readPreference('custom' + name, defaultValue)
      return [name, /^#[0-9a-f]{6}$/i.test(saved) ? saved : defaultValue]
    }),
  ))

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
  }, [theme, customColors])

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
    writePreference('flicker', String(flickerEnabled))
  }, [flickerEnabled])

  useEffect(() => {
    const page = pathname.replace(/\/$/, '')
    document.title = page === '/projects' ? 'Projects | Ansh Jetli'
      : page === '/resume' ? 'Resume | Ansh Jetli'
      : page === '' ? 'Ansh Jetli' : 'Page not found | Ansh Jetli'
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  function openEmailDialog() {
    emailDialogRef.current.showModal()
  }

  return (
    <>
      <BackgroundEffects glowEnabled={glowEnabled} grainEnabled={grainEnabled} driftEnabled={driftEnabled} flickerEnabled={flickerEnabled} />
      <div className="layout">
        <Sidebar onEmailClick={openEmailDialog} theme={theme} onThemeChange={setTheme}
          customColors={customColors} onCustomColorsChange={setCustomColors}
          glowEnabled={glowEnabled} onGlowChange={setGlowEnabled}
          grainEnabled={grainEnabled} onGrainChange={setGrainEnabled}
          driftEnabled={driftEnabled} onDriftChange={setDriftEnabled}
          flickerEnabled={flickerEnabled} onFlickerChange={setFlickerEnabled} />
        <main className="right-panel content" key={pathname}>
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
