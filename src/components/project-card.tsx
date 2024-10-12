import { Project } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({ project }: { project: Project }) {
  const { title, description, img, github } = project;
  return (
    <Link href={github} target="_blank">
      <div className="sm:hover:border-deeppurple border-deeppurple group flex max-w-4xl cursor-pointer flex-col items-center rounded-sm border p-3 hover:shadow-lg sm:border-transparent lg:flex-row">
        <div className="w-5/6 lg:w-fit">
          <Image
            src={img}
            className="m-1"
            alt={`${title} image`}
            width="300"
            height="300"
          />
        </div>
        <div className="mt-6 flex w-full flex-col space-y-2 px-2 sm:px-8 lg:mt-0 lg:w-fit">
          <h2 className="group-hover:text-deeppurple text-xl font-bold transition-colors duration-200">
            {title}
          </h2>
          <p className="text-muted-foreground group-hover:text-slate-950 dark:group-hover:text-white">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
