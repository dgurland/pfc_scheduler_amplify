import React, { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "../../App.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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
import { Button, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import classNames from "classnames";

type EditorProps = {
  scheduleEntriesByPeriod: ScheduleEntry[][];
  activities: Activity[];
  numPeriods: number;
  afterActivitySubmit: Function;
  scheduleId: string;
  editingType: CREATE_UPDATE;
  date?: Dayjs | null;
  schedules: Schedule[];
  previousSchedule?: Schedule;
  resetEditor: Function;
}

const Editor = (props: EditorProps) => {
  const { scheduleEntriesByPeriod, activities, numPeriods, scheduleId, date, editingType, schedules, previousSchedule, resetEditor } = props;
  const API = generateClient({ authMode: 'apiKey' });
  const [tableData, setTableData] = useState<ScheduleEntry[][]>()
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(date ? dayjs(date, "MM/DD/YYYY") : null);
  const [templateName, setTemplateName] = useState<string>("");
  const [divisionForMobile, setDivisionForMobile] = useState<DIVISIONS>(DIVISIONS.JRG)
  useEffect(() => {
    console.log(scheduleEntriesByPeriod, scheduleId, date, schedules)
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
    if ((editingType == CREATE_UPDATE.EDIT && previousSchedule?.id) || previousSchedule?.date?.includes("WORKING_edit")) {
      //delete old entries
      await deleteOldSchedule(previousSchedule.id)

    }
    const x = await updateSchedule(scheduleId, templateName?.length > 0 ? templateName : selectedDate?.format('MM/DD/YYYY'));
    resetEditor();
  }

  async function updateSchedule(id, date) {
    return API.graphql({
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
    //TODO: waterfall deletion
    return API.graphql({
      query: deleteScheduleMutation,
      variables: {
        input: {
          id: id
        },
      },
    });
  }

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

  return (
    <div className="p-2">
      <Button onClick={() => resetEditor(false)}><ArrowBackIosIcon />Go Back</Button>
      <div className="md:hidden">
      <Select value={divisionForMobile} key={"divisions"}
          onChange={(event) => setDivisionForMobile(event?.target.value as DIVISIONS)}
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
      </div>
      <Table>
        <TableHead>
        <TableRow>
              <TableCell />
              {Object.keys(DIVISIONS).filter((key) => isNaN(Number(key))).map((divisionKey) => {
                return (
                  <TableCell key={divisionKey} className={classNames("sm:flex", { "hidden": divisionForMobile !== undefined && divisionForMobile !== DIVISIONS[divisionKey] })}>{divisionKey}</TableCell>
                )
              })}
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
                    <TableCell key={`${i}-${j}`} className={classNames("sm:flex", { "hidden": divisionForMobile !== undefined && divisionForMobile !== j })}>
                      <ActivitySelect key={`${i}-${j}`} period={i} division={j} activities={activities} scheduleEntry={entry} onChange={props.afterActivitySubmit} facilityUsage={facilityUsageForPeriod(i)} createScheduleEntry={createScheduleEntry} />
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Date" name="date" value={selectedDate} onChange={(d) => setSelectedDate(d)} disabled={editingType == CREATE_UPDATE.EDIT} disablePast shouldDisableDate={disableDate} />
          </LocalizationProvider>
          OR
          <TextField value={templateName} onChange={(event) => setTemplateName(event.target.value)} placeholder="Save as template">
          </TextField>
          <Button variant="contained" onClick={() => onSubmit()} disabled={!selectedDate}>
            Save
          </Button>
        </div>
      </View>
    </div>
  )
}

export default Editor;