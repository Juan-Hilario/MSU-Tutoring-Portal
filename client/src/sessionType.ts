
//type DateString = `${`${0 | 1 | 2}${number}` | `3[01]`}-${`0${number}` | `1[0-2]`}-${number}`;
export type TimeString = `${`${0 | 1}${number}` | `2${0 | 1 | 2 | 3}`}:${`${0 | 1 | 2 | 3 | 4 | 5}${number}`}`;
export type DayString = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export type TAInfo = {
  name: string;
  id: string;
}
export interface Session {
  id: string,
  title: string,
  section: string,
  courseName: string,
  days: string[],
  start: TimeString,
  end: TimeString,
  TAs: TAInfo[],
  location: string,
}


