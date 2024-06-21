import dayjs from "dayjs";
import calendar from 'dayjs/plugin/calendar';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(calendar);

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const dateFormat = {
  sameDay: 'HH:mm',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: 'DD-MMM-YY',
  sameElse: 'DD-MMM-YY',
};

export function formatDate(
  dateval: string,
  formatString: string = "MMM D",
  diff: boolean = false
): string {
  let returnval = dayjs(dateval).tz(userTimezone).format(formatString);
  if (diff) {
    const dateDiff =
      dayjs().diff(dayjs(dateval), "d") < 1
        ? "Today"
        : `${dayjs().diff(dayjs(dateval), "d")}d ago`;
    returnval = `${returnval} • ${dateDiff}`;
  }

  return returnval;
}

export function relativeDate(dateval: string): string {
  return dayjs(dateval).calendar(null, dateFormat)
}

export function formatTime(duration: number) {
  // convert milliseconds to seconds
  const totalSeconds = Math.floor(duration / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}
