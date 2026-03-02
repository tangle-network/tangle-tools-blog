export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-neutral-500 dark:text-neutral-400 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Tangle Network. All rights reserved.</p>
        <div className="flex gap-6">
          <a
            href="https://tangle.tools"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            tangle.tools
          </a>
          <a
            href="https://docs.tangle.tools"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Docs
          </a>
          <a
            href="/feed.xml"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
