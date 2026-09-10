// Structured calendar code parser & generator for RYD STUDIO
// Code syntax: [Month]:[Class][Status]
// Examples:
// 2:3ab = 2nd Month, 3rd Class, Absent
// 2:3res = 2nd Month, 3rd Class, Rescheduled
// 2:3pr = 2nd Month, 3rd Class, Present

export function generateCalendarCode(
  monthIndex: number,
  classIndex: number,
  status: 'present' | 'absent' | 'rescheduled' | 'late' | 'scheduled'
): string {
  let statusSuffix = 'sch';
  if (status === 'absent') statusSuffix = 'ab';
  else if (status === 'rescheduled') statusSuffix = 'res';
  else if (status === 'present') statusSuffix = 'pr';
  else if (status === 'late') statusSuffix = 'lt';

  return `${monthIndex}:${classIndex}${statusSuffix}`;
}

export function parseCalendarCode(code: string): { month: number; classNum: number; meaning: string } {
  const parts = code.split(':');
  if (parts.length !== 2) {
    return { month: 1, classNum: 1, meaning: 'Regular Session' };
  }
  const month = parseInt(parts[0], 10) || 1;
  const match = parts[1].match(/^(\d+)([a-z]+)$/i);
  if (!match) {
    return { month, classNum: parseInt(parts[1], 10) || 1, meaning: 'Scheduled' };
  }
  const classNum = parseInt(match[1], 10);
  const codeType = match[2].toLowerCase();

  let meaning = 'Class Session';
  if (codeType === 'ab') meaning = `${month}nd Month, ${classNum}rd Class, Absent Logged`;
  else if (codeType === 'res') meaning = `${month}nd Month, ${classNum}rd Class, Rescheduled`;
  else if (codeType === 'pr') meaning = `${month}nd Month, ${classNum}rd Class, Present`;
  else if (codeType === 'lt') meaning = `${month}nd Month, ${classNum}rd Class, Late Check-in`;

  return { month, classNum, meaning };
}

export function createGoogleCalendarUrl(params: {
  title: string;
  description: string;
  location: string;
  dateStr: string; // "YYYY-MM-DD"
  timeStr: string; // "16:00" or "16:00 - 17:30"
  durationMinutes?: number;
  calendarCode?: string;
}): string {
  const { title, description, location, dateStr, timeStr, durationMinutes = 90, calendarCode } = params;
  
  // Parse start time
  const startTimePart = timeStr.split('-')[0].trim();
  const [hours, minutes] = startTimePart.split(':').map((n) => parseInt(n, 10) || 0);

  const startYear = parseInt(dateStr.slice(0, 4), 10) || 2026;
  const startMonth = parseInt(dateStr.slice(5, 7), 10) - 1 || 8;
  const startDay = parseInt(dateStr.slice(8, 10), 10) || 10;

  const startDate = new Date(startYear, startMonth, startDay, hours, minutes);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const formatGoogleDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';

  const fullTitle = calendarCode ? `[${calendarCode}] ${title}` : title;
  const fullDescription = `${description}\n\nRYD STUDIO Structured Code: ${calendarCode || 'N/A'}\nLocation: ${location}\nStatus: Confirmed Sync`;

  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const url = `${baseUrl}&text=${encodeURIComponent(fullTitle)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent(fullDescription)}&location=${encodeURIComponent(location)}`;

  return url;
}

export function downloadIcsFile(params: {
  title: string;
  description: string;
  location: string;
  dateStr: string;
  timeStr: string;
  durationMinutes?: number;
  calendarCode?: string;
}): void {
  const { title, description, location, dateStr, timeStr, durationMinutes = 90, calendarCode } = params;

  const startTimePart = timeStr.split('-')[0].trim();
  const [hours, minutes] = startTimePart.split(':').map((n) => parseInt(n, 10) || 0);
  const startYear = parseInt(dateStr.slice(0, 4), 10) || 2026;
  const startMonth = parseInt(dateStr.slice(5, 7), 10) - 1 || 8;
  const startDay = parseInt(dateStr.slice(8, 10), 10) || 10;

  const startDate = new Date(startYear, startMonth, startDay, hours, minutes);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const formatIcsDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';

  const fullTitle = calendarCode ? `[${calendarCode}] ${title}` : title;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RYD STUDIO//Class Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${fullTitle}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')} (Code: ${calendarCode || 'N/A'})`,
    `LOCATION:${location}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `RYD-STUDIO-${calendarCode || 'session'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
