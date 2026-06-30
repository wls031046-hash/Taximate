import type { ListFilters, ModeFilter } from "../types";
import { RIDE_MODE_LABEL } from "../types";

interface RideFiltersProps {
  filters: ListFilters;
  onChange: (filters: ListFilters) => void;
  resultCount: number;
}

const MODE_OPTIONS: { value: ModeFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "pickup", label: RIDE_MODE_LABEL.pickup },
  { value: "together", label: RIDE_MODE_LABEL.together },
];

export default function RideFilters({ filters, onChange, resultCount }: RideFiltersProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">도착지 검색</span>
          <input
            type="text"
            value={filters.to}
            onChange={(e) => onChange({ ...filters, to: e.target.value })}
            placeholder="예: 인천공항, 강남역"
            className="w-full rounded-xl border border-line bg-stone-50 px-3.5 py-2.5 text-sm outline-none focus:border-taxi-dark focus:ring-2 focus:ring-taxi/30"
          />
        </label>

        <div>
          <span className="mb-1.5 block text-xs font-semibold text-muted">합승 방식</span>
          <div className="flex flex-wrap gap-2">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...filters, mode: opt.value })}
                className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                  filters.mode === opt.value
                    ? "bg-ink text-white"
                    : "border border-line bg-stone-50 text-muted hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        <span className="font-semibold text-ink">{resultCount}건</span>의 합승
      </p>
    </div>
  );
}
