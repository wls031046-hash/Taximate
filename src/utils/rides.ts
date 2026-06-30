import type { ListFilters, Ride } from "../types";

function locationHit(ride: Ride, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return ride.from.toLowerCase().includes(q) || ride.to.toLowerCase().includes(q);
}

export function filterRides(rides: Ride[], filters: ListFilters): Ride[] {
  const queries = [filters.from, filters.to]
    .map((q) => q.trim().toLowerCase())
    .filter(Boolean);

  return rides.filter((ride) => {
    if (filters.mode !== "all" && ride.mode !== filters.mode) return false;
    if (queries.length === 0) return true;
    return queries.some((q) => locationHit(ride, q));
  });
}

export function sortRides(rides: Ride[]): Ride[] {
  return [...rides].sort(
    (a, b) => new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime(),
  );
}
