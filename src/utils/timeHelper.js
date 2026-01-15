export function nowLocal() { return new Date(); }

export function isWorkday(d) {
  const day = d.getDay();
  return day >= 1 && day <= 5;
}

export function inWorkWindow(d) {
  if (!isWorkday(d)) return false;
  const m = d.getHours() * 60 + d.getMinutes();
  return m >= 7 * 60 && m < 19 * 60; // 07:00 - 19:00
}