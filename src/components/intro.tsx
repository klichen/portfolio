export default function Intro() {
  return (
    <section className="flex flex-col items-start gap-x-10 gap-y-4 border-b-2 border-deeppurple pb-12 sm:border-b-4 sm:pb-20 md:flex-row md:items-center">
      <div className="self mt-2 flex-1 items-center justify-center sm:text-center md:mt-0">
        <h1 className="text-2xl">Hey, I&#39;m Kevin</h1>
        <p className="mt-3 text-xl font-normal text-muted-foreground">
          I&#39;m a software developer who likes learning, building, and solving
          real problems.
        </p>
        <p className="mt-3 text-xl font-normal text-muted-foreground">
          Making cool stuff that could help people is what I&#39;m all about.
        </p>
      </div>
    </section>
  );
}
