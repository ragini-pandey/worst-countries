import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/85 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <nav
        aria-label="Primary"
        className="flex h-14 w-full items-center justify-between gap-6 px-6"
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-[15px] font-semibold uppercase tracking-[0.12em] text-neutral-900 dark:text-neutral-50"
        >
          <span aria-hidden className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 via-rose-500 to-orange-400 opacity-90 shadow-[0_0_18px_rgba(239,68,68,0.45)] transition-transform group-hover:scale-110" />
            <span className="relative text-[11px] font-bold text-white">W</span>
          </span>
          <span className="flex items-baseline">
            <span>WORST</span>
            <span className="mx-0.5 text-neutral-300 dark:text-neutral-600">/</span>
            <span className="text-neutral-500 dark:text-neutral-400">COUNTRIES</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 sm:flex">
            <li>
              <Link
                href="/about"
                className="rounded-md px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                About
              </Link>
            </li>
          </ul>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Source on GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:inline-flex dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.93 10.93 0 0 1 5.74 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
            </svg>
          </a>
          <span className="mx-1 hidden h-5 w-px bg-neutral-200 sm:block dark:bg-neutral-800" aria-hidden />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}


