import { useEffect, useRef, useState } from 'react'
import Dialog from './Dialog.jsx'
import { colorFields, defaultGradientStrength, extraThemes, gradientFields, surfaceFields } from './themeColors.js'

export default function ThemeControls({ theme, onThemeChange, customColors, onCustomColorsChange, customStrength, onCustomStrengthChange, backgroundEnabled, onBackgroundChange, glowEnabled, onGlowChange, grainEnabled, onGrainChange, driftEnabled, onDriftChange }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const [draftColors, setDraftColors] = useState(customColors)
  const [draftStrength, setDraftStrength] = useState(customStrength)
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
    setDraftStrength(customStrength)
    setOpenMenu(null)
    setSubmenuOpen(false)
    dialogRef.current.showModal()
  }

  function resetCustomDraft() {
    setDraftColors(Object.fromEntries(colorFields.map(({ name, defaultValue }) => [name, defaultValue])))
    setDraftStrength(defaultGradientStrength)
  }

  function colorInput({ name, label }) {
    return (
      <label className="custom-theme-color" key={name}>
        <span>{label}</span>
        <small>{draftColors[name].toUpperCase()}</small>
        <input type="color" value={draftColors[name]}
          onChange={(event) => setDraftColors({ ...draftColors, [name]: event.target.value })} />
      </label>
    )
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
              <button type="button" onClick={openCustomPicker}>{theme === 'custom' ? 'Edit custom' : 'Custom'}</button>
            </div>
          </div>
        </>)}
        {menu('effects-menu', 'Background effects', <i className="fas fa-wand-magic-sparkles" aria-hidden="true" />, <>
          {toggleButton('Gradient', backgroundEnabled, onBackgroundChange)}
          {toggleButton('Grain', grainEnabled, onGrainChange)}
          {toggleButton('Glow', glowEnabled, onGlowChange)}
          {toggleButton('Motion', driftEnabled, onDriftChange)}
        </>)}
      </div>
      <Dialog dialogRef={dialogRef} className="custom-prompt" titleId="custom-prompt-title">
        <h2 className="modal__title" id="custom-prompt-title">Custom theme</h2>
        <form className="custom-theme-form" onSubmit={(event) => {
          event.preventDefault()
          onCustomColorsChange(draftColors)
          onCustomStrengthChange(draftStrength)
          onThemeChange('custom')
          dialogRef.current.close()
        }}>
          <div className="custom-theme-preview" aria-label="Theme color preview" style={{
            '--preview-bg': draftColors['--bg'],
            '--preview-panel': draftColors['--bg-subtle'],
            '--preview-text': draftColors['--text'],
            '--preview-muted': draftColors['--text-muted'],
            '--preview-accent': draftColors['--accent'],
            '--preview-border': draftColors['--border'],
            '--preview-wash-1': draftColors['--wash-1'],
            '--preview-wash-2': draftColors['--wash-2'],
            '--preview-wash-3': draftColors['--wash-3'],
            '--preview-strength': `${draftStrength}%`,
          }}>
            <span className="custom-theme-preview__label">Preview</span>
            <div className="custom-theme-preview__card">
              <strong>Project title</strong>
              <span>Sample text with a <span className="custom-theme-preview__link">link</span>.</span>
            </div>
          </div>
          <fieldset className="custom-theme-section">
            <legend>Site colors</legend>
            <div className="custom-theme-grid">{surfaceFields.map(colorInput)}</div>
          </fieldset>
          <fieldset className="custom-theme-section">
            <legend>Gradient colors</legend>
            <div className="custom-theme-grid custom-theme-grid--gradient">{gradientFields.map(colorInput)}</div>
          </fieldset>
          <label className="custom-theme-strength">
            <span>Gradient strength <output>{draftStrength}%</output></span>
            <input type="range" min="0" max="100" step="1" value={draftStrength}
              onChange={(event) => setDraftStrength(Number(event.target.value))} />
          </label>
          <div className="modal__actions">
            <button type="button" className="modal__button" onClick={resetCustomDraft}>Reset</button>
            <button type="button" className="modal__button" onClick={() => dialogRef.current.close()}>Cancel</button>
            <button type="submit" className="modal__button modal__button--primary">Apply</button>
          </div>
        </form>
      </Dialog>
    </>
  )
}
