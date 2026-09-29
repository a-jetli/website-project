import { useEffect, useRef, useState } from 'react'
import Dialog from './Dialog.jsx'
import { colorFields, extraThemes } from './themeColors.js'

export default function ThemeControls({ theme, onThemeChange, customColors, onCustomColorsChange, glowEnabled, onGlowChange, grainEnabled, onGrainChange, driftEnabled, onDriftChange, flickerEnabled, onFlickerChange }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const [draftColors, setDraftColors] = useState(customColors)
  const controlsRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!openMenu) return
    function closeOutside(event) {
      if (!controlsRef.current.contains(event.target)) {
        setOpenMenu(null)
        setSubmenuOpen(false)
      }
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setOpenMenu(null)
        setSubmenuOpen(false)
        controlsRef.current.querySelector(`[aria-controls="${openMenu}"]`).focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [openMenu])

  function chooseTheme(value) {
    onThemeChange(value)
    setOpenMenu(null)
    setSubmenuOpen(false)
  }

  function openCustomPicker() {
    setDraftColors(customColors)
    setOpenMenu(null)
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

  function toggleButton(label, enabled, onChange) {
    return (
      <button type="button" aria-pressed={enabled} onClick={() => onChange(!enabled)}>
        {label}: {enabled ? 'On' : 'Off'}
      </button>
    )
  }

  function menu(id, label, icon, items) {
    const open = openMenu === id
    return (
      <div className="theme-switcher">
        <button type="button" className="theme-icon" aria-label={label}
          aria-expanded={open} aria-controls={id}
          onClick={() => { setOpenMenu(open ? null : id); setSubmenuOpen(false) }}>{icon}</button>
        <div className={`theme-menu${open ? ' open' : ''}`} id={id} inert={!open}>
          {items}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="theme-controls" ref={controlsRef}>
        {menu('theme-menu', 'Choose theme', '◐', <>
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
        </>)}
        {menu('effects-menu', 'Background effects', <i className="fas fa-wand-magic-sparkles" aria-hidden="true" />, <>
          {toggleButton('Grain', grainEnabled, onGrainChange)}
          {toggleButton('Glow', glowEnabled, onGlowChange)}
          {toggleButton('Drift', driftEnabled, onDriftChange)}
          {toggleButton('Flicker', flickerEnabled, onFlickerChange)}
        </>)}
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
