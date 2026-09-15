import { useEffect, useRef, useState } from 'react'
import Dialog from './Dialog.jsx'
import { colorFields, extraThemes } from './themeColors.js'

export default function ThemeControls({ theme, onThemeChange, customColors, onCustomColorsChange, glowEnabled, onGlowChange, grainEnabled, onGrainChange }) {
  const [open, setOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const [draftColors, setDraftColors] = useState(customColors)
  const controlsRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function closeOutside(event) {
      if (!controlsRef.current.contains(event.target)) {
        setOpen(false)
        setSubmenuOpen(false)
      }
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        setSubmenuOpen(false)
        controlsRef.current.querySelector('.theme-icon').focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  function chooseTheme(value) {
    onThemeChange(value)
    setOpen(false)
    setSubmenuOpen(false)
  }

  function openCustomPicker() {
    setDraftColors(customColors)
    setOpen(false)
    setSubmenuOpen(false)
    dialogRef.current.showModal()
  }

  function themeButton(value, label) {
    return (
      <button type="button" key={value} className={theme === value ? 'active' : ''} onClick={() => chooseTheme(value)}>
        {label}
      </button>
    )
  }

  return (
    <>
      <div className="theme-switcher" ref={controlsRef}>
        <button type="button" className="theme-icon" aria-label="Choose theme"
          aria-expanded={open} aria-controls="theme-menu"
          onClick={() => { setOpen(!open); setSubmenuOpen(false) }}>◐</button>
        <div className={`theme-menu${open ? ' open' : ''}`} id="theme-menu" inert={!open}>
          {themeButton('light', 'Light')}
          {themeButton('dark', 'Dark')}
          <div className="theme-submenu-wrapper"
            onMouseEnter={() => setSubmenuOpen(true)} onMouseLeave={() => setSubmenuOpen(false)}>
            <button type="button" className="has-submenu" aria-expanded={submenuOpen}
              aria-controls="theme-submenu" onClick={() => setSubmenuOpen(true)}>Other ▸</button>
            <div className={`theme-submenu${submenuOpen ? ' open' : ''}`} id="theme-submenu" inert={!submenuOpen}>
              {extraThemes.map(({ value, label }) => themeButton(value, label))}
              <button type="button" onClick={openCustomPicker}>Custom</button>
            </div>
          </div>
          <button type="button" aria-pressed={grainEnabled} onClick={() => onGrainChange(!grainEnabled)}>Grain: {grainEnabled ? 'On' : 'Off'}</button>
          <button type="button" aria-pressed={glowEnabled} onClick={() => onGlowChange(!glowEnabled)}>Glow: {glowEnabled ? 'On' : 'Off'}</button>
        </div>
      </div>
      <Dialog dialogRef={dialogRef} className="modal--compact custom-prompt" titleId="custom-prompt-title">
        <h2 className="modal__title" id="custom-prompt-title">Custom theme</h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          onCustomColorsChange(draftColors)
          onThemeChange('custom')
        }}>
          {colorFields.map(({ name, label }) => (
            <label key={name}>
              {label}
              <input type="color" value={draftColors[name]}
                onChange={(event) => setDraftColors({ ...draftColors, [name]: event.target.value })} />
            </label>
          ))}
          <div className="modal__actions">
            <button type="submit" className="modal__button modal__button--primary">Apply</button>
            <button type="button" className="modal__button" onClick={() => dialogRef.current.close()}>Close</button>
          </div>
        </form>
      </Dialog>
    </>
  )
}
