import { ScheduleEntry } from "../types";

const organizeTableEntries = (scheduleFromAPI: ScheduleEntry[]) => {
  if (!scheduleFromAPI) {
    return []
  }
  let sortedSchedule: ScheduleEntry[][] = scheduleFromAPI?.reduce((accumulator: ScheduleEntry[][], currentValue: ScheduleEntry) => {
    const period = currentValue.period;
    if (accumulator[period]) {
      accumulator[period].push(currentValue)
    } else {
      accumulator[period] = [currentValue]
    }
    return accumulator;
  }, [])
  sortedSchedule = sortedSchedule.map((list: ScheduleEntry[]) => {
    return list.sort((a, b) => a.division > b.division ? 1 : -1)
  })
  return sortedSchedule;
}

export { organizeTableEntries }