import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/90 pb-3 pt-6 backdrop-blur-sm">
      <nav className="container flex max-w-5xl items-start justify-between pl-0 pr-8">
        <div>
          <Link href="/" className="font-serif text-2xl font-bold">
            <Image
              alt="kevdev-logo"
              className="transform transition-transform duration-200 active:scale-75 md:hover:scale-150"
              src="/images/logo.svg"
              width="125"
              height="125"
            />
          </Link>
        </div>

        <div className="flex flex-row gap-5">
          <ul className="flex items-center gap-6 text-base font-normal text-muted-foreground sm:gap-10">
            <li className="transition-colors active:scale-90 md:hover:text-foreground">
              <Link href="/projects">Projects</Link>
            </li>
          </ul>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
