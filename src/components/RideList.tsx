import type { Ride } from "../types";
import RideCard from "./RideCard";

interface RideListProps {
  rides: Ride[];
  emptyMessage: string;
  onJoin: (rideId: string) => void;
}

export default function RideList({ rides, emptyMessage, onJoin }: RideListProps) {
  if (rides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white py-16 text-center">
        <span className="text-4xl opacity-40">🚕</span>
        <p className="mt-3 text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rides.map((ride) => (
        <RideCard key={ride.id} ride={ride} onJoin={onJoin} />
      ))}
    </div>
  );
}
