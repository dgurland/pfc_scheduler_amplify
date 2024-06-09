import React, { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "../../App.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
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
import { Button, Checkbox, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import classNames from "classnames";
import { facilityUsageForPeriod, kidCountsByDivision } from "../../common/helpers";
import PeriodInput from "./PeriodInput";

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
  periodNames: string[]
}

const Editor = (props: EditorProps) => {
  const { scheduleEntriesByPeriod, activities, numPeriods, scheduleId, date, editingType, schedules, previousSchedule, resetEditor, periodNames } = props;
  const API = generateClient({ authMode: 'apiKey' });
  const [tableData, setTableData] = useState<ScheduleEntry[][]>()
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(date ? dayjs(date, "MM/DD/YYYY") : null);
  const [templateName, setTemplateName] = useState<string>("");
  const [divisionForMobile, setDivisionForMobile] = useState<DIVISIONS>(DIVISIONS.JRG)
  const [periodNamesList, setPeriodNamesList] = useState<string[]>(periodNames);
  const [selectedCells, setSelectedCells] = useState<ScheduleEntry[]>([]);
  const [activitySelectOpen, setActivitySelectOpen] = useState(false);
  useEffect(() => {
    setTableData(tableRows());
  }, [scheduleEntriesByPeriod])

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

  useEffect(() => {
    if (!activitySelectOpen) {
      setSelectedCells([]);
    }
  }, [activitySelectOpen])

  const disableDate = (date: Dayjs) => {
    return schedules.find((schedule => schedule.date == date.format('MM/DD/YYYY'))) != undefined
  }

  async function onSubmit() {
    if ((editingType == CREATE_UPDATE.EDIT && previousSchedule?.id) || previousSchedule?.date?.includes("WORKING_edit")) {
      //delete old entries
      const x = await deleteOldSchedule(previousSchedule.id);
      console.log(x);

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
          date: date,
          periodNames: periodNamesList
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

  const multiplePeriodsEditing = () => {
    const periodEditing = selectedCells.map((cell) => cell.period);
    const deduped = [...new Set(periodEditing)]
    return deduped.length > 1
  }

  return (
    <div className="p-2">
      <div className="flex justify-between flex-col lg:flex-row">
      <Button onClick={() => resetEditor(false)}><ArrowBackIosIcon />Go Back</Button>
      <Button onClick={() => setActivitySelectOpen(true)} disabled={selectedCells.length == 0}><EditIcon />Edit {selectedCells.length == 1 ? "1 Item" : selectedCells.length > 1 ? `${selectedCells.length} Items` : ''}</Button>
      </div>
      <ActivitySelect activities={activities} scheduleEntries={selectedCells} onChange={props.afterActivitySubmit} facilityUsage={multiplePeriodsEditing() ? {} : facilityUsageForPeriod(selectedCells[0]?.period, scheduleEntriesByPeriod, activities)} createScheduleEntry={createScheduleEntry} isOpen={activitySelectOpen} setIsOpen={setActivitySelectOpen} enableFacilityUsage={!multiplePeriodsEditing()} />
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
                <TableCell key={divisionKey} className={classNames("sm:flex", { "hidden": divisionForMobile !== undefined && divisionForMobile !== DIVISIONS[divisionKey] })}>{divisionKey} ({kidCountsByDivision(DIVISIONS[divisionKey])})</TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.map((row: ScheduleEntry[], i) => {
            return (
              <TableRow key={i}>
                <TableCell key={`period-${i}`}>
                  <PeriodInput index={i} value={periodNamesList} setValue={setPeriodNamesList} />
                </TableCell>
                {row.map((entry: ScheduleEntry, j) => {
                  return (
                    <TableCell key={`${i}-${j}`} className={classNames("sm:flex", { "hidden": divisionForMobile !== undefined && divisionForMobile !== j })}>
                      <span>{entry.activities?.items?.map((item) => `${item.activity.name}${item.label ? " (" + item.label + ")" : ''}`).join(', ')}</span>
                      <Checkbox
                        key={`cell-${i}-${j}`}
                        checked={selectedCells.find((cell) => cell.period == entry.period && cell.division == entry.division) != undefined}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelectedCells(selectedCells.concat([entry]))
                          } else {
                            setSelectedCells(selectedCells.filter((e) => !(e.period == entry.period && e.division == entry.division)))
                          }
                        }}
                      />
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