export default function ResumePage() {
  return (
    <section className="resume-page">
      <h1 className="bio-heading" style={{ color: 'var(--accent)' }}>Resume</h1>
      <a className="resume-download" href="/ansh_resume_web.pdf" download>Download PDF ↓</a>
      <p className="resume-fallback">
        If the preview doesn't load, <a href="/ansh_resume_web.pdf" target="_blank" rel="noreferrer">open the PDF directly</a>.
      </p>
      <iframe src="/ansh_resume_web.pdf" title="Ansh Jetli's resume" />
    </section>
  )
}
