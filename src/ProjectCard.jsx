import ProjectGallery from './ProjectGallery.jsx'
import { getProjectMedia } from './projectMedia.js'

function LinkedText({ text, link }) {
  if (!link) return text
  const index = text.indexOf(link.label)
  if (index === -1) return text
  return (
    <>
      {text.slice(0, index)}
      <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
      {text.slice(index + link.label.length)}
    </>
  )
}

function ProjectDescription({ description, link, className }) {
  const paragraphs = Array.isArray(description) ? description : [description]
  return paragraphs.map((text, index) => (
    <p className={className} key={index}><LinkedText text={text} link={link} /></p>
  ))
}

export default function ProjectCard({ project, variant = 'full' }) {
  const isHome = variant === 'home'
  const Heading = isHome ? 'h3' : 'h2'
  const media = getProjectMedia(project.id)

  if (variant === 'compact') {
    return (
      <article className="project-card project-card--compact">
        <div className="project-small">
          <div className="project-small-copy">
            <div className="project-small-header">
              <h3 className={project.repoUrl ? 'project-name-small' : 'project-name-small static'}>
                {project.repoUrl ? (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer">{project.title}</a>
                ) : project.title}
              </h3>
              <span className="project-stack-small">{project.stack.join(' · ')}</span>
            </div>
            <ProjectDescription description={project.description} link={project.credit} className="project-small-desc" />
          </div>
          <ProjectGallery project={project} media={media} />
        </div>
      </article>
    )
  }

  const demoLabel = project.demoUrl?.replace('https://', '')
  const narrativeLink = demoLabel ? { label: demoLabel, url: project.demoUrl } : null

  return (
    <article className={`project-card project-card--${variant}`}>
      <div className={(isHome ? 'project-featured project-inline' : 'project-featured') +
        (isHome && media.length ? ' project-featured--with-gallery' : '')}>
        <div className="project-featured-copy">
          <div className="project-header">
            <Heading>
              {project.repoUrl ? (
                <a className="project-name-linked" href={project.repoUrl} target="_blank" rel="noreferrer">
                  {project.title}
                  {isHome && <> <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: '0.7em' }} aria-hidden="true" /></>}
                </a>
              ) : <span className="project-name">{project.title}</span>}
            </Heading>
            {(project.demoUrl || project.status) && (
              <span className="project-links">
                {project.demoUrl ? (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer">
                    Live demo <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" />
                  </a>
                ) : <span className="project-status">{project.status}</span>}
              </span>
            )}
          </div>
          {!isHome && <ProjectDescription description={project.description} className="project-desc" />}
          <span className="project-stack">{project.stack.join(' · ')}</span>
          {isHome && project.summary && <p className="project-summary">{project.summary}</p>}
        </div>
        <ProjectGallery project={project} media={media} />
      </div>
      {isHome && <ProjectDescription description={project.description} link={narrativeLink ?? project.credit} />}
    </article>
  )
}
