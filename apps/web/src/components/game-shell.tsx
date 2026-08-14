import Link from 'next/link';

interface GameShellProps {
  gameName: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

export function GameShell({ gameName, headerRight, children }: GameShellProps) {
  return (
    <main className="min-h-screen bg-surface text-on-surface font-body flex flex-col items-center">
      <div className="w-full max-w-content mx-auto px-margin-mobile py-sm flex flex-col gap-md flex-1">
        <header className="flex items-center justify-between py-sm">
          <Link
            href="/games"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
            aria-label="Exit game"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </Link>
          <h1 className="font-display text-headline-sm text-on-surface">{gameName}</h1>
          <div className="w-10 h-10 flex items-center justify-end">{headerRight}</div>
        </header>
        <div className="flex-1 flex flex-col gap-md">{children}</div>
      </div>
    </main>
  );
}
