import React, { useEffect, useState } from "react";
import { Activity, DIVISIONS, MAX_DAYS_FOR_EXPORT, Schedule } from "../types";
import { Button, FormControl, MenuItem, Select, Switch } from "@mui/material";
import { listActivitiesWithFacilityData } from "../graphql/custom-queries";
import { generateClient } from "aws-amplify/api";

type ExporterProps = {
  schedules: Schedule[]
}

const Exporter = (props: ExporterProps) => {
  const { schedules } = props;
  const API = generateClient({ authMode: 'apiKey' });
  const [byActivity, setByActivity] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([])
  const [division, setDivision] = useState<DIVISIONS>(DIVISIONS.JRG);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  useEffect(() => {
    fetchActivities();
  })

  async function fetchActivities() {
    const apiData = await API.graphql({ query: listActivitiesWithFacilityData });
    const activitiesFromAPI = apiData.data.listActivities.items;
    setAllActivities(activitiesFromAPI);
  }

  const generateCSV = () => {
    const schedulesToExport = schedules
      .filter((schedule) => selectedSchedules.includes(schedule.id));
    const rows = [];
    if (schedulesToExport.length == 1) {
      const schedule = schedulesToExport[0];
      const entries = schedule.entries?.items;
      rows[0] = ([""].concat(Object.keys(DIVISIONS).filter((key) => isNaN(Number(key)))));
      for (let period = 0; period < schedule.periods; period++) {
        const currentRow = [`Period ${period + 1}`];
        for (let division = 0; division < Object.keys(DIVISIONS).filter((key) => isNaN(Number(key))).length; division++) {
          const entryForDivisionForPeriod = entries.find((entry) => entry.period === period && entry.division == division);
          if (entryForDivisionForPeriod) {
            currentRow.push(entryForDivisionForPeriod.activities?.items?.map((activity) => `${activity.activity.name}${activity.label ? " (" + activity.label + ")" : ''}`).join(';'));
          } else {
            currentRow.push("")
          }
        }
        rows.push(currentRow);
      }
    } else {
      rows[0] = ([""].concat(schedulesToExport.map((schedule) => schedule.date)));
      if (byActivity) {
        for (let i = 1; i < 9; i++) {
          const currentRow = [`Period ${i}`];
          schedulesToExport.forEach((currentSchedule) => {
            const entries = currentSchedule.entries?.items;
            const entriesForPeriod = entries.filter((entry) => entry.period === i - 1);
            if (entriesForPeriod) {
              let filteredActivities = [];
              entriesForPeriod.forEach((entry) => {
                filteredActivities = filteredActivities.concat((entry.activities?.items?.filter((e) => selectedActivities.includes(e.activity.id))).map((activity) => {
                  return (DIVISIONS[entry.division])
                }))
              })
              currentRow.push(filteredActivities.join(';'))
            } else {
              currentRow.push("")
            }
          })
          rows.push(currentRow);
        }
      } else {
        for (let i = 1; i < 9; i++) {
          const currentRow = [`Period ${i}`];
          schedulesToExport.forEach((currentSchedule) => {
            const entries = currentSchedule.entries?.items;
            const entryForPeriod = entries.find((entry) => entry.period === i - 1 && entry.division === division);
            if (entryForPeriod) {
              currentRow.push(entryForPeriod.activities?.items?.map((activity) => `${activity.activity.name}${activity.label ? " (" + activity.label + ")" : ''}`).join(';'));
            } else {
              currentRow.push("")
            }
          })
          rows.push(currentRow);
        }
      }
    }

    const csv = rows.map((row) => row.join(',')).join('\n');
    const universalBom = "\uFEFF";
    const blobParts = [universalBom + csv];
    const blobOptions: BlobPropertyBag = {
      type: "text/csv;charset=UTF-8"
    };
    const file = new Blob(blobParts, blobOptions);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(file);
    link.download = `${byActivity ? 'area' : DIVISIONS[division]}-schedules.csv`;
    link.click();
  }

  return (
    <div className="flex flex-col items-center">
      <div className="Heading font-bold text-xl w-full text-center p-4">Export Schedules</div>
      <div className="flex flex-col gap-4">
        <Select label="Schedules" multiple value={selectedSchedules} onChange={(event) => setSelectedSchedules(event.target.value)}>
          {schedules?.map((schedule) => {
            return (
              <MenuItem value={schedule.id} disabled={selectedSchedules.length >= MAX_DAYS_FOR_EXPORT && !selectedSchedules.includes(schedule.id)}>
                {schedule.date}
              </MenuItem>
            )
          })}
        </Select>
        {selectedSchedules.length > 1 && (
          <div>
            <div className="">
              by division<Switch checked={byActivity} onChange={(event) => setByActivity(event.target.checked)}></Switch>by activity area
            </div>
            {byActivity ? (
              <Select multiple value={selectedActivities} key={"activities"}
                onChange={(event) => {
                  setSelectedActivities(event.target.value)
                }}
                classes={{
                  root: "w-full"
                }}
              >
                {allActivities.map((activity, i) => {
                  return (
                    <MenuItem value={activity.id} key={`activity-${i}`}>{activity.name}<span className="text-xs ml-2">({activity.facility?.name})</span></MenuItem>
                  )
                })}
              </Select>) : (<Select label="Division" value={division} key={"divisions"}
                onChange={(event) => setDivision(event?.target.value as DIVISIONS)}
                classes={{
                  root: "w-full h-[50%]"
                }}
              >
                {Object.keys(DIVISIONS).filter((key) => isNaN(Number(key))).map((divisionKey) => {
                  return (
                    <MenuItem value={DIVISIONS[divisionKey]} key={divisionKey}>{divisionKey}</MenuItem>
                  )
                })}
              </Select>)}
          </div>
        )}
        <Button variant="contained" onClick={() => generateCSV()} disabled={selectedSchedules.length == 0}>Download</Button>
      </div>
    </div>
  )
}

export default Exporter;