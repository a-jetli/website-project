import { useState } from 'react'
import ProjectCard from './ProjectCard.jsx'
import projects from './projects.js'

export default function ProjectsPage() {
  const [category, setCategory] = useState('all')
  const visibleProjects = projects.filter((project) =>
    category === 'all' || project.category === category
  )
  const mainProjects = visibleProjects.filter((project) => project.section === 'main')
  const otherProjects = visibleProjects.filter((project) => project.section === 'other')

  return (
    <div className="page">
      <section id="projects">
        <h1 className="bio-heading" style={{ color: 'var(--accent)' }}>Projects</h1>
        <p className="lead">A mix of coursework, hackathons, and personal projects. Some repos are private.</p>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All</option>
            <option value="backend">Backend</option>
            <option value="ai">AI</option>
            <option value="web">Web</option>
            <option value="desktop">Desktop &amp; Android</option>
            <option value="languages">Languages</option>
          </select>
        </label>
        {mainProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
      {otherProjects.length > 0 && (
        <section>
          <h2>Other Projects</h2>
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="compact" />
          ))}
        </section>
      )}
    </div>
  )
}
