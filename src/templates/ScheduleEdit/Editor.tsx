import React, { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "../../App.css";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  View,
  Heading,
  Flex
} from "@aws-amplify/ui-react";
import {
  updateSchedule as updateScheduleMutation,
  deleteSchedule as deleteScheduleMutation
} from "../../graphql/mutations";
import {
  createScheduleEntry as createScheduleEntryMutation
} from "../../graphql/custom-mutations"
import { DIVISIONS, Facility as FacilityType, Activity, ScheduleEntry, Schedule, CREATE_UPDATE } from "../../types";
import ActivitySelect from "../../common/components/ActivitySelect";
import dayjs, { Dayjs } from "dayjs";
import { Button } from "@mui/material";

type EditorProps = {
  scheduleEntriesByPeriod: ScheduleEntry[][];
  activities: Activity[];
  numPeriods: number;
  afterActivitySubmit: Function;
  scheduleId: string;
  editingType: CREATE_UPDATE;
  date?: Dayjs | null;
  schedules: Schedule[];
  previousScheduleId?: string;
  resetEditor: Function;
}

const Editor = (props: EditorProps) => {
  const { scheduleEntriesByPeriod, activities, numPeriods, scheduleId, date, editingType, schedules, previousScheduleId, resetEditor } = props;
  const API = generateClient({ authMode: 'apiKey' });
  const [tableData, setTableData] = useState<ScheduleEntry[][]>()
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(date ? dayjs(date, "MM/DD/YYYY") : null);

  useEffect(() => {
    setTableData(tableRows());
  }, [scheduleEntriesByPeriod])

  function facilityUsageForPeriod(period) {
    const entries: ScheduleEntry[] = scheduleEntriesByPeriod[period] ?? [];
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

  async function createScheduleEntry(period, division) {
    const data = {
      period: period,
      division: division,
      scheduleEntriesId: scheduleId,
    }
    return await API.graphql({
      query: createScheduleEntryMutation,
      variables: { input: data },
    });
  }

  const disableDate = (date: Dayjs) => {
    return schedules.find((schedule => schedule.date == date.format('MM/DD/YYYY'))) != undefined
  }

  async function onSubmit() {
    if (editingType == CREATE_UPDATE.EDIT && previousScheduleId) {
      //delete old entries
      await deleteOldSchedule(previousScheduleId)

    }
    updateSchedule(scheduleId, selectedDate?.format('MM/DD/YYYY'));
    resetEditor();
  }

  async function updateSchedule(id, date) {
    return await API.graphql({
      query: updateScheduleMutation,
      variables: {
        input: {
          id: id,
          date: date
        },
      },
    });
  }

  async function deleteOldSchedule(id: string) {
    return await API.graphql({
      query: deleteScheduleMutation,
      variables: {
        input: {
          id: id
        },
      },
    });
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
          {tableData?.map((row: ScheduleEntry[], i) => {
            return (
              <TableRow key={i}>
                <TableCell key={`period-${i}`}>
                  Period {i + 1}
                </TableCell>
                {row.map((entry: ScheduleEntry, j) => {
                  return (
                    <TableCell key={`${i}-${j}`}>
                      <ActivitySelect period={i} division={j} activities={activities} scheduleEntry={entry} onChange={props.afterActivitySubmit} facilityUsage={facilityUsageForPeriod(i)} createScheduleEntry={createScheduleEntry} />
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <View as="form" margin="3rem 0">
        <Heading level={3}>Save Schedule</Heading>
        <Flex direction="row" justifyContent="center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Date" name="date" value={selectedDate} onChange={(d) => setSelectedDate(d)} disabled={editingType == CREATE_UPDATE.EDIT} disablePast shouldDisableDate={disableDate} />
          </LocalizationProvider>
          <Button variant="contained" onClick={() => onSubmit()}>
            Save
          </Button>
        </Flex>
      </View>
    </View>
  )
}

export default Editor;