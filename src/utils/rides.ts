import type { ListFilters, Ride } from "../types";

export function filterRides(rides: Ride[], filters: ListFilters): Ride[] {
  const to = filters.to.trim().toLowerCase();

  return rides.filter((ride) => {
    if (to && !ride.to.toLowerCase().includes(to)) return false;
    if (filters.mode !== "all" && ride.mode !== filters.mode) return false;
    return true;
  });
}

export function sortRides(rides: Ride[]): Ride[] {
  return [...rides].sort(
    (a, b) => new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime(),
  );
}
