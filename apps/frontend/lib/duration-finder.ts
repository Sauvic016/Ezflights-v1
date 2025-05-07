import { differenceInHours, differenceInMinutes, addDays } from "date-fns";

type TimeStamp = string | number | Date;
export function getDuration(startTime: TimeStamp, endTime: TimeStamp) {
  const start = new Date(startTime);
  let end = new Date(endTime);

  // If end time is before start time, add 1 day to end time
  if (end < start) {
    end = addDays(end, 1);
  }

  const hours = differenceInHours(end, start);
  const minutes = differenceInMinutes(end, start) % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  if (hours === 0) {
    return `${formattedMinutes} min`;
  }

  return `${formattedHours} hr ${formattedMinutes} min`;
}
