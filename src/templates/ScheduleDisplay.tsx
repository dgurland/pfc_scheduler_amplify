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
import { DIVISIONS, Facility as FacilityType, Activity, ScheduleEntry } from "../types";
import { organizeTableEntries } from "../common/helpers";
import { listScheduleEntriesWithActivityNames } from "../graphql/custom-queries";
import dayjs from "dayjs";

type ScheduleDisplayProps = {
  date: string;
}

const ScheduleDisplay = (props: ScheduleDisplayProps) => {
  const [scheduleEntriesByPeriod, setScheduleEntries] = useState<ScheduleEntry[][]>([]);
  const numPeriods = 6;
  const API = generateClient({ authMode: 'apiKey' });

  useEffect(() => {
    fetchScheduleEntries();
  }, []);

  async function fetchScheduleEntries() {
    const apiData = await API.graphql({ query: listScheduleEntriesWithActivityNames, variables: { filter: { scheduleEntriesId: { eq: "e00c74d4-ed44-41b4-9ec4-285bae9b4542" } } } });
    const scheduleFromAPI = apiData.data.listScheduleEntries.items;
    const sortedSchedule = organizeTableEntries(scheduleFromAPI);
    setScheduleEntries(sortedSchedule);
  }

  const tableRows = (): ScheduleEntry[][] => {
    let row: ScheduleEntry[][] = []
    for (let i = 0; i < numPeriods; i++) {
      row[i] = [];
      const dataForPeriod: ScheduleEntry[] = scheduleEntriesByPeriod[i] ?? [];
      Object.keys(DIVISIONS).filter((key) => isNaN(Number(key))).forEach((divisionKey) => {
        const d = DIVISIONS[divisionKey]
        if (dataForPeriod[d]?.division == d) {
          row[i].push(dataForPeriod[d]);
        } else {
          const dummyEntry: ScheduleEntry = {
            date: "",
            id: "",
            activities: [],
            activityIds: [],
            period: i,
            division: d
          }
          row[i].push(dummyEntry)
        }
      })
    }
    return row;
  }

  return (
    <View>
      <div className="m-4 font-bold text-xl">
        {dayjs().isSame(dayjs(props.date, "MM/DD/YYYY"), 'day') ? <span>Today's Schedule</span> : <span>Schedule For {props.date}</span>}
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              Jr Girls
            </TableCell>
            <TableCell>
              Int Girls
            </TableCell>
            <TableCell>
              Sr Girls
            </TableCell>
            <TableCell>
              HS Girls
            </TableCell>
            <TableCell>
              Jr Boys
            </TableCell>
            <TableCell>
              Int Boys
            </TableCell>
            <TableCell>
              Sr Boys
            </TableCell>
            <TableCell>
              HS Boys
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows().map((row: ScheduleEntry[], i) => {
            return (
              <TableRow key={i}>
                <TableCell key={`period-${i}`}>
                  Period {i + 1}
                </TableCell>
                {row.map((entry: ScheduleEntry, j) => {
                  return (
                    <TableCell key={`${i}-${j}`}>
                      {entry.activities?.items?.map((activity) => `${activity.activity.name}${activity.label ? " (" + activity.label + ")" : ''}`).join(', ')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </View>
  );
};

export default ScheduleDisplay;