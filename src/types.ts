export type RideStatus = "open" | "full";
export type RideMode = "pickup" | "together";
export type ModeFilter = "all" | RideMode;
export type Tab = "browse" | "create" | "my";

export interface User {
  id: string;
  name: string;
  rating: number;
}

export interface Passenger {
  userId: string;
  name: string;
  joinedAt: string;
}

export interface Ride {
  id: string;
  hostId: string;
  hostName: string;
  from: string;
  to: string;
  departureAt: string;
  maxSeats: number;
  mode: RideMode;
  passengers: Passenger[];
  status: RideStatus;
}

export interface RideFormData {
  from: string;
  to: string;
  departureAt: string;
  maxSeats: number;
  mode: RideMode;
}

export interface ListFilters {
  from: string;
  to: string;
  mode: ModeFilter;
}

export const CURRENT_USER: User = {
  id: "u-me",
  name: "박유진",
  rating: 4.8,
};

export const RIDE_MODE_LABEL: Record<RideMode, string> = {
  pickup: "경유 픽업",
  together: "동반 출발",
};

export const RIDE_MODE_DESC: Record<RideMode, string> = {
  pickup: "가는 길에 있는 사람을 도중에 태우기",
  together: "출발지에서 함께 출발하기",
};

/** 본인(호스트) 포함 현재 인원 */
export function currentCount(ride: Ride): number {
  return 1 + ride.passengers.length;
}

export function isHost(ride: Ride, userId: string): boolean {
  return ride.hostId === userId;
}

export function isPassenger(ride: Ride, userId: string): boolean {
  return ride.passengers.some((p) => p.userId === userId);
}

export function isJoined(ride: Ride, userId: string): boolean {
  return isHost(ride, userId) || isPassenger(ride, userId);
}

export function canJoin(ride: Ride, userId: string): boolean {
  return ride.status === "open" && !isJoined(ride, userId) && currentCount(ride) < ride.maxSeats;
}
