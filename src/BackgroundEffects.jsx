import { useEffect, useRef } from 'react'
import './BackgroundEffects.css'

export default function BackgroundEffects({ glowEnabled, grainEnabled }) {
  const glowRef = useRef(null)
  const grainRef = useRef(null)

  useEffect(() => {
    if (!grainEnabled) return
    const canvas = grainRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let image
    let timer

    function paintGrain() {
      context.putImageData(image, 0, 0)
      // Matching halves let the CSS movement loop without a seam.
      context.putImageData(image, image.width, 0)
    }

    function randomizePixel(i) {
      const shade = Math.floor(Math.random() * 256)
      image.data[i] = shade
      image.data[i + 1] = shade
      image.data[i + 2] = shade
      image.data[i + 3] = 255
    }

    function resizeGrain() {
      const width = Math.ceil(canvas.clientWidth / 4)
      canvas.width = width * 2
      canvas.height = Math.ceil(canvas.clientHeight / 2)
      image = context.createImageData(width, canvas.height)
      for (let i = 0; i < image.data.length; i += 4) randomizePixel(i)
      paintGrain()
    }

    function evolveGrain() {
      if (!image) return
      const pixels = image.data.length / 4
      for (let i = 0; i < pixels * 0.08; i++) {
        randomizePixel(Math.floor(Math.random() * pixels) * 4)
      }
      paintGrain()
    }

    function updateAnimation() {
      clearInterval(timer)
      if (!reducedMotion.matches && !document.hidden) {
        timer = setInterval(evolveGrain, 100)
      }
    }

    const observer = new ResizeObserver(resizeGrain)
    observer.observe(canvas)
    reducedMotion.addEventListener('change', updateAnimation)
    document.addEventListener('visibilitychange', updateAnimation)
    updateAnimation()
    return () => {
      clearInterval(timer)
      observer.disconnect()
      reducedMotion.removeEventListener('change', updateAnimation)
      document.removeEventListener('visibilitychange', updateAnimation)
    }
  }, [grainEnabled])

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
      <div className={`ambient-background${grainEnabled ? '' : ' ambient-background--disabled'}`}
        aria-hidden="true" style={{ opacity: grainEnabled ? 1 : 0 }}>
        <canvas className="ambient-grain" ref={grainRef} />
      </div>
      <div className="mouse-glow" ref={glowRef} aria-hidden="true" style={{ opacity: glowEnabled ? 1 : 0 }} />
    </>
  )
}
