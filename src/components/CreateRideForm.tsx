import { useState } from "react";
import type { RideFormData, RideMode } from "../types";
import { RIDE_MODE_DESC, RIDE_MODE_LABEL } from "../types";

interface CreateRideFormProps {
  onSubmit: (data: RideFormData) => void;
}

const DEFAULT: RideFormData = {
  from: "",
  to: "",
  departureAt: "",
  maxSeats: 3,
  mode: "together",
};

const MODES: RideMode[] = ["pickup", "together"];

export default function CreateRideForm({ onSubmit }: CreateRideFormProps) {
  const [form, setForm] = useState<RideFormData>(DEFAULT);
  const [error, setError] = useState("");

  const set =
    (key: keyof RideFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = key === "maxSeats" ? Number(e.target.value) : e.target.value;
      setForm((s) => ({ ...s, [key]: val }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.from.trim() || !form.to.trim()) {
      setError("출발 위치와 도착 위치를 입력해 주세요.");
      return;
    }
    if (!form.departureAt) {
      setError("출발 예정 시간을 선택해 주세요.");
      return;
    }
    if (new Date(form.departureAt) <= new Date()) {
      setError("출발 시간은 현재 이후여야 해요.");
      return;
    }
    if (form.maxSeats < 2 || form.maxSeats > 4) {
      setError("모집 인원은 본인 포함 2~4명이에요.");
      return;
    }
    setError("");
    onSubmit(form);
    setForm(DEFAULT);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-ink">합승 등록</h2>
        <p className="mt-1 text-sm text-muted">같은 방향으로 가는 승객을 모집해 보세요.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="출발 위치" required>
            <input
              value={form.from}
              onChange={set("from")}
              placeholder="강남역 2번 출구"
              className={inputCls}
            />
          </Field>
          <Field label="도착 위치" required>
            <input
              value={form.to}
              onChange={set("to")}
              placeholder="인천공항 T1"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="출발 예정 시간" required className="mt-4">
          <input
            type="datetime-local"
            value={form.departureAt}
            onChange={set("departureAt")}
            className={inputCls}
          />
        </Field>

        <Field label="모집 인원 (본인 포함)" required className="mt-4">
          <select value={form.maxSeats} onChange={set("maxSeats")} className={inputCls}>
            <option value={2}>2명 (본인 + 1명)</option>
            <option value={3}>3명 (본인 + 2명)</option>
            <option value={4}>4명 (본인 + 3명)</option>
          </select>
        </Field>

        <fieldset className="mt-5">
          <legend className="mb-2 text-xs font-semibold text-muted">
            합승 방식 <span className="text-red-500">*</span>
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setForm((s) => ({ ...s, mode }))}
                className={`rounded-xl border p-3.5 text-left transition ${
                  form.mode === mode
                    ? "border-taxi-dark bg-taxi/15 ring-2 ring-taxi/25"
                    : "border-line bg-stone-50 hover:border-stone-300"
                }`}
              >
                <span className="block text-sm font-bold text-ink">{RIDE_MODE_LABEL[mode]}</span>
                <span className="mt-0.5 block text-xs text-muted">{RIDE_MODE_DESC[mode]}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-ink py-3 text-sm font-bold text-white transition hover:bg-stone-800"
        >
          합승 등록하기
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-stone-50 px-3.5 py-2.5 text-sm outline-none focus:border-taxi-dark focus:ring-2 focus:ring-taxi/30";

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold text-muted">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
