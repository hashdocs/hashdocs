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
