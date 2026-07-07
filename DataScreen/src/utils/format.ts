export function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatDateTime(date = new Date()): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export function formatTime(date = new Date()): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });
}
