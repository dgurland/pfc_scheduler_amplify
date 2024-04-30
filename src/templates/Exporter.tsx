import React, { useState } from "react";
import { DIVISIONS, MAX_DAYS_FOR_EXPORT, Schedule } from "../types";
import { Button, FormControl, MenuItem, Select } from "@mui/material";

type ExporterProps = {
  schedules: Schedule[]
}

const Exporter = (props: ExporterProps) => {
  const { schedules } = props;
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([])
  const [division, setDivision] = useState<DIVISIONS>(DIVISIONS.JRG);

  const generateCSV = () => {
    const rows = [];
    const schedulesToExport = schedules
      .filter((schedule) => selectedSchedules.includes(schedule.id));
    rows.push([""].concat(schedulesToExport.map((schedule) => schedule.date)));
    schedulesToExport.forEach((schedule, i) => {
      const entries = schedule.entries?.items?.filter((entry) => entry.division === division).sort((a, b) => a.period - b.period);
      console.log(entries)
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
    const csv = rows.map((row) => row.join(',')).join('\n');
    const universalBom = "\uFEFF";
    const blobParts    = [ universalBom + csv ];
    const blobOptions: BlobPropertyBag = {
      type: "text/csv;charset=UTF-8"
    };
    const file = new Blob( blobParts, blobOptions );
    const link = document.createElement( "a" );
    link.href     = window.URL.createObjectURL( file );
    link.download = `${DIVISIONS[division]}-schedules.csv`;
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
          <Select label="Division" value={division} key={"divisions"}
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
          </Select>
        )}
        <Button variant="contained" onClick={() => generateCSV()}>Download</Button>
      </div>
    </div>
  )
}

export default Exporter;