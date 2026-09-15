import ProjectCard from './ProjectCard.jsx'
import projects from './projects.js'
import homeProjects from './homeProjects.js'
import SocialLinks from './SocialLinks.jsx'

export default function HomePage({ onEmailClick }) {
  const selectedProjects = homeProjects.map((entry) => {
    const project = projects.find((project) => project.id === entry.projectId)
    if (!project) throw new Error(`Unknown Home project: ${entry.projectId}`)
    return {
      ...project,
      description: entry.description ?? project.description,
      stack: entry.stack ?? project.stack,
    }
  })

  return (
    <div className="page">
      <section id="intro">
        <h1 className="bio-heading" style={{ color: 'var(--accent)' }}>Hi, I'm Ansh!</h1>
        <p>I'm a final semester senior CS student at Rutgers University New Brunswick, based in New Jersey.</p>
        <p>
          My coursework spans from basics like data structures and algorithms to specifics like software methodology,
          intro to artificial intelligence, data science topics, and programming language theory. I've studied in
          languages like Java, C, and Python, taken courses using OCaml and R, as well as used popular libraries like
          NumPy and Pandas. Most of my personal work now is in applied AI and backend work in Python.
        </p>
      </section>

      <section>
        <h2>What I'm Looking For</h2>
        <p>I'm looking for full time new grad software engineering roles starting in January 2027, particularly in applied AI and backend development.</p>
        <p>I'm open to work within the continental US, but particularly targeting the NYC metro area. I'm currently based in central NJ.</p>
      </section>

      <section>
        <h2>Recent work</h2>

        {selectedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            variant="home"
          />
        ))}
      </section>

      <section>
        <h2>Education</h2>
        <div className="edu-entry">
          <div className="edu-top">
            <span className="edu-school">Rutgers University, New Brunswick</span>
            <span className="edu-year">Graduating Dec 2026</span>
          </div>
          <p className="edu-degree">B.S. Computer Science</p>
        </div>
        <div className="edu-entry">
          <div className="edu-top">
            <span className="edu-school">Raritan Valley Community College</span>
            <span className="edu-year">2024</span>
          </div>
          <p className="edu-degree">A.S. Computer Science</p>
        </div>
      </section>

      <section>
        <h2>Hobbies</h2>
        <p>
          When I'm not busy with school or projects, I enjoy reading and playing video games. I'm a fan of anything in
          the fantasy genre, and right now I'm going through the Red Rising series and learning to love sci-fi. I'm mostly playing indie games now, but I've
          been a long time fan of big multiplayer games like Overwatch and Destiny 2. Single player RPGs
          also have a special place in my heart. I'm constantly listening to music (hence why I made Rotation) and I'm
          self-learning how to play the guitar.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>The best way to reach me is via email or LinkedIn. Please feel free to reach out.</p>
        <SocialLinks className="contact-links" onEmailClick={onEmailClick} />
      </section>
    </div>
  )
}
