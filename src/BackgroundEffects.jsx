import { useEffect, useRef } from 'react'
import Grainient from './Grainient.jsx'
import './BackgroundEffects.css'

export default function BackgroundEffects({ backgroundEnabled, glowEnabled, grainEnabled, driftEnabled }) {
  const glowRef = useRef(null)

  useEffect(() => {
    if (!glowEnabled) return
    function followMouse(event) {
      glowRef.current.style.transform = `translate(${event.clientX - 400}px, ${event.clientY - 400}px)`
    }
    document.addEventListener('mousemove', followMouse)
    return () => document.removeEventListener('mousemove', followMouse)
  }, [glowEnabled])

  return (
    <>
      {backgroundEnabled && <div className="ambient-background" aria-hidden="true">
        <Grainient grainEnabled={grainEnabled} motionEnabled={driftEnabled} />
      </div>}
      <div className="mouse-glow" ref={glowRef} aria-hidden="true" style={{ opacity: glowEnabled ? 1 : 0 }} />
    </>
  )
}
