export interface Attendance {
  id: string,
  eventId: string,
  taId: string,
  date: string,
  status: "Present" | "Absent"

}
