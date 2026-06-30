export function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h < 12 ? "오전" : "오후";
  const hour12 = h % 12 || 12;
  return `${ampm} ${hour12}:${String(m).padStart(2, "0")}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateStr = d.toDateString();
  if (dateStr === today.toDateString()) return "오늘";
  if (dateStr === tomorrow.toDateString()) return "내일";
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function formatCurrency(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

export function minutesUntil(iso: string): number {
  return Math.round((new Date(iso).getTime() - Date.now()) / 60000);
}

export function timeLabel(iso: string): string {
  const mins = minutesUntil(iso);
  if (mins < 0) return "출발 완료";
  if (mins < 60) return `${mins}분 후 출발`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}시간 ${m}분 후` : `${h}시간 후`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
