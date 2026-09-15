import { useEffect, useRef, useState } from 'react'
import Dialog from './Dialog.jsx'

export default function EmailDialog({ dialogRef }) {
  const [status, setStatus] = useState('')
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  function resetCopyState() {
    window.clearTimeout(resetTimer.current)
    setCopied(false)
    setStatus('')
  }

  async function copyAddress() {
    const parts = ['ansh', 'jetli', 'gmail', 'com']
    const address = `${parts[0]}.${parts[1]}${String.fromCharCode(64)}${parts[2]}.${parts[3]}`
    try {
      await navigator.clipboard.writeText(address)
      if (!dialogRef.current.open) return
      window.clearTimeout(resetTimer.current)
      setCopied(true)
      setStatus('Email address copied to clipboard.')
      resetTimer.current = window.setTimeout(resetCopyState, 2500)
    } catch {
      setStatus('Copy unavailable. Please enter the address manually.')
    }
  }

  return (
    <Dialog dialogRef={dialogRef} titleId="email-dialog-title"
      descriptionId="email-dialog-description" onClose={resetCopyState}>
      <h2 className="modal__title" id="email-dialog-title">Email me</h2>
      <p className="modal__text" id="email-dialog-description">
        To limit web scrapers, my email address is written out below.
      </p>
      <p className="modal__code" aria-label="ansh dot jetli at gmail dot com">
        ansh [dot] jetli [at] gmail [dot] com
      </p>
      <div className="modal__actions">
        <button type="button" className="modal__button modal__button--primary" onClick={copyAddress}>
          {copied ? 'Copied' : 'Copy address'}
        </button>
        <button type="button" className="modal__button" onClick={() => dialogRef.current.close()}>Close</button>
      </div>
      <p className="modal__status" role="status">{status}</p>
    </Dialog>
  )
}
