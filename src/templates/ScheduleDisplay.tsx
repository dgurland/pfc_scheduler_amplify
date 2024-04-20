import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import "../App.css";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  View,
  Heading
} from "@aws-amplify/ui-react";
import { DIVISIONS, Facility as FacilityType, Activity, ScheduleEntry, Schedule } from "../types";
import { organizeTableEntries } from "../common/helpers";
import { MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import classNames from "classnames";

type ScheduleDisplayProps = {
  schedule?: Schedule;
  defaultDivision?: DIVISIONS;
}

const ScheduleDisplay = (props: ScheduleDisplayProps) => {
  const { defaultDivision } = props;
  const [scheduleEntriesByPeriod, setScheduleEntries] = useState<ScheduleEntry[][]>([]);
  const numPeriods = 6;
  const API = generateClient({ authMode: 'apiKey' });
  const [divisionForMobile, setDivisionForMobile] = useState<DIVISIONS | undefined>(defaultDivision ?? DIVISIONS.JRG);
  useEffect(() => {
    setScheduleEntries(organizeTableEntries(props.schedule?.entries?.items));
  }, [props.schedule]);

  useEffect(() => {
    setDivisionForMobile(defaultDivision);
  }, [defaultDivision]);

  const tableRows = (): ScheduleEntry[][] => {
    let rows: ScheduleEntry[][] = []
    const divisions = Object.keys(DIVISIONS).filter((key) => isNaN(Number(key)));
    for (let i = 0; i < numPeriods; i++) {
      const row = [];
      const dataForPeriod: ScheduleEntry[] = scheduleEntriesByPeriod[i] ?? [];
      for (let j = 0; j < divisions.length; j++) {
        let divisionData = dataForPeriod.find((dataEntry) => dataEntry.division == j);
        if (divisionData) {
          row[j] = divisionData;
        } else {
          row[j] = {
            id: "",
            activities: [],
            period: i,
            division: j
          };
        }
      }
      rows.push(row)
    }
    return rows;
  }

  if (!props.schedule) {
    return (
      <div>No upcoming schedules to show</div>
    )
  }

  return (
    <div>
      <div className="sm:hidden w-full my-2 px-4 container">
        <Select value={divisionForMobile}
          onChange={(event) => setDivisionForMobile(event?.target.value as DIVISIONS)}
          classes={{
            root: "w-full"
          }}
        >
          {Object.keys(DIVISIONS).filter((key) => isNaN(Number(key))).map((divisionKey) => {
            return (
              <MenuItem value={DIVISIONS[divisionKey]} key={divisionKey}>{divisionKey}</MenuItem>
            )
          })}
          <MenuItem value={undefined} key={"all"}>Show all</MenuItem>
        </Select>
      </div>
      <div className="m-4 font-bold text-xl">
        {dayjs().isSame(dayjs(props.schedule?.date, "MM/DD/YYYY"), 'day') ? <span>Today's Schedule</span> : <span>Schedule For {props.schedule?.date}</span>}
      </div>
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {Object.keys(DIVISIONS).filter((key) => isNaN(Number(key))).map((divisionKey) => {
                return (
                  <TableCell key={divisionKey} className={classNames("sm:flex", { "hidden":  divisionForMobile !== DIVISIONS[divisionKey] })}>{divisionKey}</TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows().map((row: ScheduleEntry[], i) => {
              return (
                <TableRow key={i}>
                  <TableCell key={`period-${i}`} className="!left-0 !sticky !bg-white">
                    Period {i + 1}
                  </TableCell>
                  {row.map((entry: ScheduleEntry, j) => {
                    return (
                      <TableCell key={`${i}-${j}`} className={classNames("sm:flex", { "hidden": divisionForMobile !== j })}>
                        {entry.activities?.items?.map((activity) => `${activity.activity.name}${activity.label ? " (" + activity.label + ")" : ''}`).join(', ')}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ScheduleDisplay;