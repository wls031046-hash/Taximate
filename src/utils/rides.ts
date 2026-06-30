import type { ListFilters, Ride } from "../types";

export function filterRides(rides: Ride[], filters: ListFilters): Ride[] {
  const from = filters.from.trim().toLowerCase();
  const to = filters.to.trim().toLowerCase();

  return rides.filter((ride) => {
    if (filters.mode !== "all" && ride.mode !== filters.mode) return false;
    if (!from && !to) return true;
    const fromOk = from ? ride.from.toLowerCase().includes(from) : false;
    const toOk = to ? ride.to.toLowerCase().includes(to) : false;
    return fromOk || toOk;
  });
}

export function sortRides(rides: Ride[]): Ride[] {
  return [...rides].sort(
    (a, b) => new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime(),
  );
}
