import HomeProjects from '@/components/home-projects';
import Intro from '@/components/intro';

export default function Home() {
  return (
    <section className="pb-24 pt-32">
      <div className="container max-w-4xl">
        <Intro />
        <HomeProjects />
      </div>
    </section>
  );
}
