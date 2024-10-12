import ProjectCard from '@/components/project-card';
import Link from 'next/link';
import projects from '@/data/projects';

export default function HomeProjects() {
  return (
    <div className="relative flex flex-col justify-between pt-4 text-left">
      <div className="pb-3">
        <h2 className="text-2xl">Here are my most recent projects :&#10091;</h2>
      </div>
      <div className="flex flex-col items-start gap-8 sm:gap-3">
        {projects.slice(0, 2).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <div className="relative mt-2 w-full">
        <Link href="/projects">
          <div className="hover:text-deeppurple hover:border-deeppurple mx-auto mt-8 w-full max-w-sm cursor-pointer whitespace-nowrap rounded-full border-2 px-8 py-3 text-center transition-colors md:max-w-xl">
            See the rest
          </div>
        </Link>
      </div>
    </div>
  );
}
