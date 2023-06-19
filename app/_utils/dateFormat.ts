import dayjs from "dayjs";

export function formatDate(
  dateval: string,
  formatString: string = "MMM D",
  diff: boolean = false
): string {
  let returnval = dayjs(dateval).format(formatString);
  if (diff) {
    const dateDiff =
      dayjs().diff(dayjs(dateval), "d") < 1
        ? "Today"
        : `${dayjs().diff(dayjs(dateval), "d")}d ago`;
    returnval = `${returnval} • ${dateDiff}`;
  }

  return returnval;
}

export function formatTime(duration: string) {
  const [hoursStr, minutesStr, secondsStr] = duration.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);

  if (hours > 0) {
    return duration;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}