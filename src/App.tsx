import { useMemo, useState } from "react";
import CreateRideForm from "./components/CreateRideForm";
import Header from "./components/Header";
import RideFilters from "./components/RideFilters";
import RideList from "./components/RideList";
import { INITIAL_RIDES } from "./data/mockData";
import type { ListFilters, Ride, RideFormData, Tab } from "./types";
import { CURRENT_USER, currentCount, isJoined } from "./types";
import { uid } from "./utils/format";
import { filterRides, sortRides } from "./utils/rides";

export default function App() {
  const [tab, setTab] = useState<Tab>("browse");
  const [rides, setRides] = useState<Ride[]>(INITIAL_RIDES);
  const [filters, setFilters] = useState<ListFilters>({ to: "", mode: "all" });
  const [toast, setToast] = useState("");

  const filtered = useMemo(
    () => sortRides(filterRides(rides, filters)),
    [rides, filters],
  );

  const myRides = useMemo(
    () => sortRides(rides.filter((r) => isJoined(r, CURRENT_USER.id))),
    [rides],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleCreate = (data: RideFormData) => {
    const ride: Ride = {
      id: uid(),
      hostId: CURRENT_USER.id,
      hostName: CURRENT_USER.name,
      from: data.from.trim(),
      to: data.to.trim(),
      departureAt: data.departureAt,
      maxSeats: data.maxSeats,
      mode: data.mode,
      passengers: [],
      status: "open",
    };
    setRides((prev) => [ride, ...prev]);
    setTab("browse");
    showToast("합승이 등록되었어요!");
  };

  const handleJoin = (rideId: string) => {
    setRides((prev) =>
      prev.map((ride) => {
        if (ride.id !== rideId) return ride;
        if (ride.status !== "open" || isJoined(ride, CURRENT_USER.id)) return ride;
        if (currentCount(ride) >= ride.maxSeats) return ride;

        const passengers = [
          ...ride.passengers,
          {
            userId: CURRENT_USER.id,
            name: CURRENT_USER.name,
            joinedAt: new Date().toISOString(),
          },
        ];
        const full = 1 + passengers.length >= ride.maxSeats;

        return {
          ...ride,
          passengers,
          status: full ? "full" : "open",
        };
      }),
    );
    showToast("합승에 참여했어요!");
  };

  return (
    <div className="min-h-full pb-10">
      <Header tab={tab} onTabChange={setTab} />

      <main className="mx-auto max-w-3xl space-y-5 px-4 pt-5">
        {tab === "browse" && (
          <>
            <RideFilters filters={filters} onChange={setFilters} resultCount={filtered.length} />
            <RideList
              rides={filtered}
              onJoin={handleJoin}
              emptyMessage="조건에 맞는 합승이 없어요. 직접 등록해 보세요!"
            />
          </>
        )}

        {tab === "create" && <CreateRideForm onSubmit={handleCreate} />}

        {tab === "my" && (
          <RideList
            rides={myRides}
            onJoin={handleJoin}
            emptyMessage="아직 참여하거나 등록한 합승이 없어요."
          />
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
