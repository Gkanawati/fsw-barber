import { setHours, setMinutes, format, addMinutes, addHours, isToday, isPast, setSeconds } from "date-fns";

function roundToNearestHalfHour(date: Date): Date {
  const minutes = date.getMinutes() > 30 ? 0 : 30;
  const hours = date.getMinutes() >= 30 ? date.getHours() + 1 : date.getHours();
  const timeWithZeroSeconds = setSeconds(date, 0);
  return setMinutes(setHours(timeWithZeroSeconds, hours), minutes);
}

export function generateDayTimeList(date: Date): string[] {
  if (isPast(date) && !isToday(date)) {
    // If the date is in the past, return an empty array
    return [];
  }

  let startTime = setMinutes(setHours(date, 9), 0); // Set start time to 09:00
  
  if (isToday(date)) {
    const potentialStartTime = roundToNearestHalfHour(addHours(new Date(), 1)); // Set start time to current time + 1 hour
    if (potentialStartTime.getHours() >= 9) {
      startTime = potentialStartTime; // Set start time to 09:00
    }
  }

  const endTime = setMinutes(setHours(date, 21), 0); // Set end time to 21:00
  const interval = 30; // interval in minutes
  const timeList: string[] = [];

  let currentTime = startTime;

  while (format(currentTime, "HH:mm") <= format(endTime, "HH:mm")) {
    timeList.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, interval);
  }

  return timeList;
}
