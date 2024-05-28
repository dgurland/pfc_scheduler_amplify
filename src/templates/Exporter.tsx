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
    const rows = new Array(9).fill(new Array(schedulesToExport.length + 1).fill(''));
    console.log(rows)
    rows[0] = ([""].concat(schedulesToExport.map((schedule) => schedule.date)));
    if (byActivity) {
      schedulesToExport.forEach((schedule, i) => {
        const entries = schedule.entries?.items;
        entries.forEach((entry) => {
          const filteredActivities = entry.activities?.items?.filter((e) => selectedActivities.includes(e.activity.id)).map((activity) => {
            return (activity.activity.name)// + selectedActivities.length > 0 ? ` (${allActivities.find((activity) => activity.id === entry.activity?.id)?.name})` : '')
          }).join(';');
          rows[entry.period + 1][i + 1] = rows[entry.period + 1][i + 1] ? [rows[entry.period + 1][i + 1], filteredActivities].join(';') : filteredActivities;
        })
      })
    } else {
      schedulesToExport.forEach((schedule, i) => {
        const entries = schedule.entries?.items?.sort((a, b) => a.period - b.period);
        let periodIndex = 0;
        for (let j = 1; j <= schedule.periods; j++) {
          if (!rows[j]) {
            rows[j] = [`Period ${j}`];
          }
          if (entries.length > j && entries[periodIndex].period !== j - 1) {
            rows[j].push("")
          } else if (entries.length > j) {
            const entry = entries[j]
            rows[j].push(entry.activities?.items?.map((activity) => `${activity.activity.name}${activity.label ? " (" + activity.label + ")" : ''}`).join('\t'));
            periodIndex++;
          }
        }
      })
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
    console.log(rows)
    // link.click();
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
                    <MenuItem value={activity.id} key={`activity-${i}`}>{activity.name}</MenuItem>
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
        <Button variant="contained" onClick={() => generateCSV()}>Download</Button>
      </div>
    </div>
  )
}

export default Exporter;