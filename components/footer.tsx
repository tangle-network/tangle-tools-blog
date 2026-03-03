export function Footer() {
  return (
    <footer className="mt-14 border-t shell-divider">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-[color:var(--text-muted)] sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Tangle Network. All rights reserved.</p>
        <div className="flex gap-6">
          <a
            href="https://tangle.tools"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[color:var(--text-strong)]"
          >
            tangle.tools
          </a>
          <a
            href="https://docs.tangle.tools"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[color:var(--text-strong)]"
          >
            Docs
          </a>
          <a
            href="/feed.xml"
            className="transition-colors hover:text-[color:var(--text-strong)]"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
