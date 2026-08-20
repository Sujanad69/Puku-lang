export function getNepalDateString(offsetDays: number = 0): string {
  const date = new Date();
  if (offsetDays !== 0) {
    date.setDate(date.getDate() + offsetDays);
  }
  
  const nepalDateString = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
  
  const [m, d, y] = nepalDateString.split('/');
  return `${y}-${m}-${d}`;
}
