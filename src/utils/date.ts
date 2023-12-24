import moment from "moment";

export const momentNowTS = () =>
  parseInt(moment(new Date(Date.now())).format("X"));

// Sun=0, Mon=1, Tue=2, etc.
export function dayOfWeek(year: number, month: number, dayOff: number = 0) {
  const monthReal = month - 1;

  let day = 1;
  let counter = 0;
  let date = new Date(year, monthReal, day);

  while (date.getMonth() === monthReal) {
    if (date.getDay() === dayOff) {
      counter += 1;
    }

    day += 1;
    date = new Date(year, monthReal, day);
  }

  return counter;
}
