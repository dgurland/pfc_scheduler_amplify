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

function facilityUsageForPeriod(period, data, activities) {
  const entries: ScheduleEntry[] = data[period] ?? [];
  const allActivitiesInUse = []
  entries?.forEach((entry: ScheduleEntry) => {
    entry.activities?.items?.forEach((activityRelation) => {
      const activityObj = activities.find((activity: Activity) => activity.id === activityRelation.activity?.id)
      if (activityObj && !allActivitiesInUse.includes(activityObj)) {
        allActivitiesInUse.push(activityObj);
      }
    })
  });
  const facilitiesWithUsages = allActivitiesInUse.reduce((accumulator, currentValue: Activity) => {
    if (accumulator[currentValue.facility.name]) {
      accumulator[currentValue.facility.name] += currentValue.usage;
    } else {
      accumulator[currentValue.facility.name] = currentValue.usage;
    }
    return accumulator;
  }, {})
  return facilitiesWithUsages;
}

export { organizeTableEntries, facilityUsageForPeriod }