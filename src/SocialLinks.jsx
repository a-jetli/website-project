export default function SocialLinks({ onEmailClick, className = 'social-links' }) {
  return (
    <div className={className}>
      <a href="https://github.com/a-jetli" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
        <i className="fab fa-github" aria-hidden="true" />
      </a>
      <a href="https://www.linkedin.com/in/anshjetli/" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
        <i className="fab fa-linkedin" aria-hidden="true" />
      </a>
      <button type="button" className="email-trigger" onClick={onEmailClick} aria-haspopup="dialog" aria-label="Show email address" title="Email">
        <i className="fas fa-envelope" aria-hidden="true" />
      </button>
    </div>
  )
}
