'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppShellProps {
  children: React.ReactNode;
  streak?: number;
}

interface NavItem {
  href: string | null;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/home', label: 'Home', icon: 'home' },
  { href: '/games', label: 'Games', icon: 'extension' },
  { href: null, label: 'Challenge', icon: 'emoji_events' },
  { href: '/leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
  { href: '/profile', label: 'Profile', icon: 'person' },
];

export function AppShell({ children, streak }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col md:flex-row pb-24 md:pb-0">
      <nav className="hidden md:flex flex-col w-64 bg-surface-container-lowest h-screen fixed left-0 top-0 shadow-[0_12px_32px_rgba(65,42,231,0.08)] z-40">
        <div className="p-lg flex items-center gap-sm">
          <span className="material-symbols-outlined filled text-primary text-3xl">psychology</span>
          <span className="font-display text-headline-md text-primary">CerebroPlay</span>
        </div>
        <div className="flex flex-col px-md gap-sm mt-md">
          {NAV_ITEMS.map((item) => (
            <DesktopNavLink key={item.label} item={item} active={isActive(pathname, item.href)} />
          ))}
        </div>
      </nav>

      <div className="flex-1 md:ml-64 w-full flex flex-col">
        {typeof streak === 'number' && (
          <header className="md:hidden flex justify-between items-center w-full max-w-content mx-auto px-margin-mobile py-sm">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined filled text-primary text-2xl">psychology</span>
              <span className="font-display text-display-lg-mobile text-primary font-bold">CerebroPlay</span>
            </div>
            <div className="flex items-center gap-xs bg-secondary-fixed/20 px-sm py-xs rounded-full">
              <span className="material-symbols-outlined filled text-secondary-container text-lg">
                local_fire_department
              </span>
              <span className="font-label-bold text-label-bold text-secondary-container">{streak}</span>
            </div>
          </header>
        )}
        {children}
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-sm pb-md pt-xs bg-surface-container-lowest shadow-[0_-8px_24px_rgba(65,42,231,0.08)] rounded-t-xl">
        {NAV_ITEMS.map((item) => (
          <MobileNavLink key={item.label} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>
    </div>
  );
}

function isActive(pathname: string | null, href: string | null): boolean {
  return href !== null && pathname !== null && pathname.startsWith(href);
}

function DesktopNavLink({ item, active }: { item: NavItem; active: boolean }) {
  const className = active
    ? 'flex items-center gap-sm px-md py-sm rounded-full bg-primary-container text-on-primary-container font-label-bold text-label-bold'
    : 'flex items-center gap-sm px-md py-sm rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md';

  if (item.href === null) {
    return (
      <div
        className="flex items-center gap-sm px-md py-sm rounded-full text-outline-variant font-label-md text-label-md cursor-default"
        title="Coming soon"
      >
        <span className="material-symbols-outlined">{item.icon}</span> {item.label}
      </div>
    );
  }

  return (
    <Link href={item.href} className={className}>
      <span className={`material-symbols-outlined ${active ? 'filled' : ''}`}>{item.icon}</span> {item.label}
    </Link>
  );
}

function MobileNavLink({ item, active }: { item: NavItem; active: boolean }) {
  if (item.href === null) {
    return (
      <div
        className="flex flex-col items-center justify-center text-outline-variant px-4 py-1"
        title="Coming soon"
      >
        <span className="material-symbols-outlined text-xl">{item.icon}</span>
        <span className="font-label-md text-[10px] mt-1">{item.label}</span>
      </div>
    );
  }

  const className = active
    ? 'flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-all duration-200'
    : 'flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-container-high active:scale-90 transition-all duration-200';

  return (
    <Link href={item.href} className={className}>
      <span className={`material-symbols-outlined text-xl ${active ? 'filled' : ''}`}>{item.icon}</span>
      <span className="font-label-md text-[10px] mt-1">{item.label}</span>
    </Link>
  );
}
