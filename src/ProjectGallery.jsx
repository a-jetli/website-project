import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function ProjectGallery({ project, media }) {
  const stripRef = useRef(null)
  const dialogRef = useRef(null)
  const viewportRef = useRef(null)
  const zoomTargetRef = useRef(null)
  const dragRef = useRef(null)
  const touchRef = useRef(null)
  const suppressClickRef = useRef(false)
  const [scrollBounds, setScrollBounds] = useState({ left: false, right: false })
  const [activeIndex, setActiveIndex] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [imageSize, setImageSize] = useState(null)
  const [viewportSize, setViewportSize] = useState(null)
  const isOpen = activeIndex !== null

  useEffect(() => {
    if (!media?.length) return
    const strip = stripRef.current
    function updateBounds() {
      const left = strip.scrollLeft > 1
      const right = strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1
      setScrollBounds((previous) => previous.left === left && previous.right === right
        ? previous : { left, right })
    }
    const observer = new ResizeObserver(updateBounds)
    observer.observe(strip)
    updateBounds()
    strip.addEventListener('scroll', updateBounds)
    return () => {
      observer.disconnect()
      strip.removeEventListener('scroll', updateBounds)
    }
  }, [media])

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    dialog.showModal()
    const viewport = viewportRef.current
    const observer = new ResizeObserver(() => {
      const width = viewport.clientWidth
      const height = viewport.clientHeight
      setViewportSize((previous) => previous?.width === width && previous.height === height
        ? previous : { width, height })
    })
    observer.observe(viewport)
    return () => {
      observer.disconnect()
      if (dialog.open) dialog.close()
    }
  }, [isOpen])

  const active = media?.[activeIndex ?? 0]
  const fit = imageSize && viewportSize
    ? Math.min(1, (viewportSize.width - 48) / imageSize.width, (viewportSize.height - 48) / imageSize.height)
    : 1
  const width = imageSize ? imageSize.width * fit * zoom : null
  const height = imageSize ? imageSize.height * fit * zoom : null

  useLayoutEffect(() => {
    if (!isOpen || !viewportSize || !width || !height) return
    const viewport = viewportRef.current
    const target = zoomTargetRef.current
    if (target && zoom > 1) {
      const left = (Math.max(width, viewportSize.width) - width) / 2
      const top = (Math.max(height, viewportSize.height) - height) / 2
      viewport.scrollLeft = left + target.x * width - target.offsetX
      viewport.scrollTop = top + target.y * height - target.offsetY
    } else {
      viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2
      viewport.scrollTop = (viewport.scrollHeight - viewport.clientHeight) / 2
    }
    zoomTargetRef.current = null
  }, [isOpen, activeIndex, zoom, imageSize, viewportSize, width, height])

  if (!media?.length) return null

  function selectImage(index) {
    if (index < 0 || index >= media.length) return
    zoomTargetRef.current = null
    setImageSize(null)
    setZoom(1)
    setActiveIndex(index)
  }

  function close() {
    setActiveIndex(null)
    setZoom(1)
    setImageSize(null)
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      selectImage(activeIndex - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      selectImage(activeIndex + 1)
    }
  }

  function scrollStrip(direction) {
    const strip = stripRef.current
    const item = strip.querySelector('button')
    strip.scrollBy({ left: direction * ((item?.offsetWidth ?? 112) + 8) })
  }

  function toggleZoom(event) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    if (zoom > 1) {
      setZoom(1)
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const viewportRect = viewportRef.current.getBoundingClientRect()
    zoomTargetRef.current = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
      offsetX: event.clientX - viewportRect.left,
      offsetY: event.clientY - viewportRect.top,
    }
    setZoom(2)
  }

  function startDrag(event) {
    if (event.pointerType === 'touch' && zoom === 1) {
      touchRef.current = { x: event.clientX, y: event.clientY }
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }
    if (zoom === 1 || event.pointerType !== 'mouse') return
    const viewport = viewportRef.current
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      left: viewport.scrollLeft,
      top: viewport.scrollTop,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveDrag(event) {
    const drag = dragRef.current
    if (!drag) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true
    if (!drag.moved) return
    const viewport = viewportRef.current
    viewport.scrollLeft = drag.left - dx
    viewport.scrollTop = drag.top - dy
  }

  function endDrag(event) {
    if (event.pointerType === 'touch' && touchRef.current) {
      const dx = event.clientX - touchRef.current.x
      const dy = event.clientY - touchRef.current.y
      touchRef.current = null
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        suppressClickRef.current = true
        selectImage(activeIndex + (dx < 0 ? 1 : -1))
        window.setTimeout(() => { suppressClickRef.current = false }, 350)
      }
      return
    }
    if (dragRef.current?.moved) suppressClickRef.current = true
    dragRef.current = null
  }

  return (
    <div className="project-gallery" aria-label={project.title + ' image previews'}>
      <div className={'project-gallery__strip' + (scrollBounds.left ? ' project-gallery__strip--fade-left' : '') +
        (scrollBounds.right ? ' project-gallery__strip--fade-right' : '')} ref={stripRef}>
        {media.map((item, index) => (
          <button type="button" key={item.src} onClick={() => selectImage(index)}
            aria-label={'Open ' + project.title + ' image ' + (index + 1) + ' of ' + media.length + ': ' + item.label}>
            <img src={item.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      {scrollBounds.left && <button className="project-gallery__scroll project-gallery__scroll--left" type="button"
        onClick={() => scrollStrip(-1)} aria-label={'Scroll ' + project.title + ' images left'}>‹</button>}
      {scrollBounds.right && <button className="project-gallery__scroll project-gallery__scroll--right" type="button"
        onClick={() => scrollStrip(1)} aria-label={'Scroll ' + project.title + ' images right'}>›</button>}
      <dialog ref={dialogRef} className="project-lightbox" aria-label={project.title + ' image viewer'}
        onClose={close} onKeyDown={handleKeyDown}>
        <div className="project-lightbox__viewport" ref={viewportRef}>
          <div className="project-lightbox__canvas" style={{
            width: width && viewportSize ? Math.max(width, viewportSize.width) : '100%',
            height: height && viewportSize ? Math.max(height, viewportSize.height) : '100%',
          }}>
            <button type="button" className={'project-lightbox__image' + (zoom > 1 ? ' project-lightbox__image--zoomed' : '')}
              onClick={toggleZoom} onPointerDown={startDrag} onPointerMove={moveDrag}
              onPointerUp={endDrag} onPointerCancel={endDrag}
              aria-label={(zoom > 1 ? 'Zoom out' : 'Zoom in') + ' ' + project.title + ' image ' + ((activeIndex ?? 0) + 1)}>
              <img key={active.src} src={active.src} alt={project.title + ': ' + active.label}
                onLoad={(event) => setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
                style={width ? { width, height } : undefined} />
            </button>
          </div>
        </div>
        <button type="button" className="project-lightbox__close" onClick={() => dialogRef.current.close()}
          aria-label="Close image viewer">×</button>
        {media.length > 1 && <>
          <button type="button" className="project-lightbox__nav project-lightbox__nav--left"
            onClick={() => selectImage(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Previous image">‹</button>
          <button type="button" className="project-lightbox__nav project-lightbox__nav--right"
            onClick={() => selectImage(activeIndex + 1)} disabled={activeIndex === media.length - 1} aria-label="Next image">›</button>
        </>}
        <span className="project-lightbox__count">{(activeIndex ?? 0) + 1} / {media.length}</span>
      </dialog>
    </div>
  )
}
