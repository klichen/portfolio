import ProjectCard from '@/components/project-card';
import projects from '@/data/projects';

export default function Projects() {
  return (
    <section className="pb-24 pt-32">
      <div className="container max-w-4xl">
        <div className="relative flex flex-col justify-between text-left">
          <div className="self mt-2 flex-1 items-center justify-center pb-12 sm:pb-20 sm:text-center md:mt-0">
            <h1 className="text-2xl">Projects</h1>
            <p className="mt-3 text-xl font-normal text-muted-foreground">
              I enjoy building projects that provide value to others and myself,
              keeping my skills sharp and allowing me to continuously learn.
            </p>
          </div>
          <div className="flex flex-col items-start gap-8 sm:gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
