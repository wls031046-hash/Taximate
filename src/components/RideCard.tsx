import type { Ride } from "../types";
import {
  CURRENT_USER,
  RIDE_MODE_LABEL,
  canJoin,
  currentCount,
  isHost,
  isJoined,
} from "../types";
import { formatDate, formatTime } from "../utils/format";

interface RideCardProps {
  ride: Ride;
  onJoin: (rideId: string) => void;
}

const STATUS_BADGE: Record<Ride["status"], { label: string; className: string }> = {
  open: { label: "모집 중", className: "bg-emerald-50 text-emerald-700" },
  full: { label: "마감", className: "bg-stone-200 text-stone-600" },
};

const MODE_BADGE: Record<Ride["mode"], string> = {
  pickup: "bg-sky-50 text-sky-700",
  together: "bg-violet-50 text-violet-700",
};

export default function RideCard({ ride, onJoin }: RideCardProps) {
  const joined = isJoined(ride, CURRENT_USER.id);
  const joinable = canJoin(ride, CURRENT_USER.id);
  const count = currentCount(ride);
  const status = STATUS_BADGE[ride.status];

  return (
    <article className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${status.className}`}>
          {status.label}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${MODE_BADGE[ride.mode]}`}>
          {RIDE_MODE_LABEL[ride.mode]}
        </span>
        {joined && !isHost(ride, CURRENT_USER.id) && (
          <span className="rounded-full bg-taxi/30 px-2.5 py-0.5 text-[11px] font-bold text-ink">
            참여 중
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <RouteDot />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-ink">{ride.from}</p>
          <p className="truncate text-sm text-muted">→ {ride.to}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span>
          {formatDate(ride.departureAt)} {formatTime(ride.departureAt)}
        </span>
        <span className="font-semibold text-ink">
          {count}/{ride.maxSeats}명
        </span>
        <span className="text-xs">호스트 · {ride.hostName}</span>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        {joined && isHost(ride, CURRENT_USER.id) ? (
          <span className="text-xs font-semibold text-muted">내가 등록한 합승</span>
        ) : joined ? (
          <span className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-muted">
            참여 완료
          </span>
        ) : (
          <button
            type="button"
            disabled={!joinable}
            onClick={() => onJoin(ride.id)}
            className={`rounded-xl px-5 py-2 text-sm font-bold transition ${
              joinable
                ? "bg-taxi text-ink hover:bg-taxi-dark hover:text-white"
                : "cursor-not-allowed bg-stone-100 text-stone-400"
            }`}
          >
            {ride.status === "full" ? "마감" : "참여하기"}
          </button>
        )}
      </div>
    </article>
  );
}

function RouteDot() {
  return (
    <div className="flex flex-col items-center gap-0.5 py-0.5">
      <span className="h-2.5 w-2.5 rounded-full bg-taxi-dark" />
      <span className="h-5 w-0.5 bg-line" />
      <span className="h-2.5 w-2.5 rounded-full border-2 border-taxi-dark bg-white" />
    </div>
  );
}
