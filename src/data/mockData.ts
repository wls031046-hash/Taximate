import type { Ride } from "../types";

const now = new Date();
const today = now.toISOString().slice(0, 10);

function at(hour: number, minute = 0): string {
  return `${today}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export const INITIAL_RIDES: Ride[] = [
  {
    id: "r1",
    hostId: "u1",
    hostName: "이지은",
    from: "강남역",
    to: "인천공항",
    departureAt: at(14, 30),
    maxSeats: 4,
    mode: "pickup",
    passengers: [{ userId: "u2", name: "박준호", joinedAt: at(9, 10) }],
    status: "open",
  },
  {
    id: "r2",
    hostId: "u3",
    hostName: "최서연",
    from: "홍대입구",
    to: "김포공항",
    departureAt: at(16, 0),
    maxSeats: 3,
    mode: "together",
    passengers: [],
    status: "open",
  },
  {
    id: "r3",
    hostId: "u4",
    hostName: "정우진",
    from: "잠실역",
    to: "수원역",
    departureAt: at(18, 15),
    maxSeats: 3,
    mode: "pickup",
    passengers: [
      { userId: "u5", name: "한소희", joinedAt: at(10, 0) },
      { userId: "u6", name: "오태양", joinedAt: at(10, 30) },
    ],
    status: "full",
  },
  {
    id: "r4",
    hostId: "u7",
    hostName: "윤하늘",
    from: "서울역",
    to: "판교역",
    departureAt: at(8, 45),
    maxSeats: 2,
    mode: "together",
    passengers: [{ userId: "u8", name: "강다은", joinedAt: at(7, 50) }],
    status: "full",
  },
  {
    id: "r5",
    hostId: "u9",
    hostName: "송민재",
    from: "신촌역",
    to: "강남역",
    departureAt: at(22, 0),
    maxSeats: 4,
    mode: "pickup",
    passengers: [],
    status: "open",
  },
];
