import { Project } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({ project }: { project: Project }) {
  const { title, description, img, github } = project;
  return (
    <Link href={github} target="_blank">
      <div className="group flex max-w-4xl cursor-pointer flex-col items-center rounded-sm border border-deeppurple p-3 transition-all hover:shadow-lg active:scale-90 md:flex-row md:border-transparent md:duration-200 md:hover:border-deeppurple">
        <div className="w-5/6 lg:w-fit">
          <Image
            src={img}
            className="m-1"
            alt={`${title} image`}
            width="300"
            height="300"
          />
        </div>
        <div className="mt-6 flex w-full flex-col space-y-2 px-2 md:pl-8 md:pr-2 lg:mt-0 lg:w-fit">
          <h2 className="text-xl font-bold transition-colors duration-200 md:group-hover:text-deeppurple">
            {title}
          </h2>
          <p className="text-muted-foreground transition-colors duration-200 md:group-hover:text-slate-950 dark:md:group-hover:text-white">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
