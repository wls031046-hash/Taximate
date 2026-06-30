import type { Tab } from "../types";
import { CURRENT_USER } from "../types";

interface HeaderProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "browse", label: "합승 찾기" },
  { key: "create", label: "합승 만들기" },
  { key: "my", label: "내 합승" },
];

export default function Header({ tab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-taxi shadow-sm">
            <TaxiIcon />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-ink">Taximate</h1>
            <p className="text-[11px] font-medium text-muted">같은 방향, 함께 타요</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-taxi text-xs font-bold text-ink">
            {CURRENT_USER.name[0]}
          </span>
          <div className="hidden text-right sm:block">
            <div className="text-xs font-bold text-ink">{CURRENT_USER.name}</div>
            <div className="text-[10px] text-muted">★ {CURRENT_USER.rating}</div>
          </div>
        </div>
      </div>
      <nav className="mx-auto flex max-w-3xl gap-1 px-4 pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.key
                ? "bg-ink text-white"
                : "text-muted hover:bg-stone-100 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function TaxiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="9" width="18" height="8" rx="2" fill="#1C1917" />
      <rect x="8" y="6" width="8" height="4" rx="1" fill="#1C1917" />
      <circle cx="7" cy="18" r="2" fill="#1C1917" />
      <circle cx="17" cy="18" r="2" fill="#1C1917" />
      <rect x="10" y="10" width="4" height="2" rx="0.5" fill="#FACC15" />
    </svg>
  );
}
