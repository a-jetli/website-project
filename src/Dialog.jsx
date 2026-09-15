export default function Dialog({ dialogRef, className = '', titleId, descriptionId, onClose, children }) {
  function closeOnBackdrop(event) {
    if (event.target !== event.currentTarget) return
    const box = event.currentTarget.getBoundingClientRect()
    const outside = event.clientX < box.left || event.clientX > box.right
      || event.clientY < box.top || event.clientY > box.bottom
    if (outside) event.currentTarget.close()
  }

  return (
    <dialog ref={dialogRef} className={`modal ${className}`} aria-labelledby={titleId}
      aria-describedby={descriptionId} onClick={closeOnBackdrop} onClose={onClose}>
      <div className="modal__content">{children}</div>
    </dialog>
  )
}
