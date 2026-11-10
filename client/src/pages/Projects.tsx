import { Link } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import RecordManager from '../components/RecordManager';

export default function Projects() {
  return (
    <section>
      <h1 className="section-title">Projects</h1>
      <p className="lead">
        A few things I've shipped recently. Each card describes my role and the
        outcome the work produced — click a title for the full write-up.
      </p>

      <div className="grid gap-5 mt-6 grid-cols-1 md:grid-cols-3">
        {PROJECTS.map((project) => (
          <article
            key={project.id}
            className="card flex flex-col gap-2"
          >
            <img
              src={project.image}
              alt={project.imageAlt}
              loading="lazy"
              className="w-full h-40 object-cover rounded-md bg-surface-2"
            />
            <h3 className="mt-2 mb-0 text-text">
              <Link
                to={`/projects/${project.id}`}
                className="text-inherit no-underline hover:text-accent hover:underline"
              >
                {project.title}
              </Link>
            </h3>
            <p className="text-accent font-semibold text-[0.95rem] m-0">
              {project.role}
            </p>
            <p className="mt-1 mb-0">{project.outcome}</p>
            <Link
              to={`/projects/${project.id}`}
              aria-label={`Read more about ${project.title}`}
              className="self-start mt-1 text-accent font-semibold no-underline hover:underline"
            >
              Details →
            </Link>
          </article>
        ))}
      </div>
    
      <h2 className="mt-12 mb-0">Project records</h2>
      <p className="lead mt-2">Project entries saved in the database.</p>
      <RecordManager
        endpoint="/api/projects"
        itemLabel="Project"
        titleLabel="Project title"
        emptyText="No project records have been added yet."
      />
    </section>
  );
}
