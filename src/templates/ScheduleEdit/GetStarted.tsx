import React, { useState, useEffect, SetStateAction } from "react";
import { RadioGroup, FormControlLabel, Radio, InputLabel, Select, Button, MenuItem } from "@mui/material";
import { Schedule, CREATE_UPDATE } from "../../types";
import {
  View,
  Heading,
  Flex,
} from "@aws-amplify/ui-react";
import { DatePicker } from "@mui/x-date-pickers";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "../../App.css";
import dayjs, { Dayjs } from "dayjs";
import {
  createSchedule as createScheduleMutation,
  createActivityScheduleEntry as createActivityScheduleEntryMutation,
} from "../../graphql/mutations";
import {
  createScheduleEntry as createScheduleEntryMutation
} from "../../graphql/custom-mutations";
import { getSchedule, listSchedules } from "../../graphql/custom-queries";


type GetStartedProps = {
  setSchedule: React.Dispatch<SetStateAction<Schedule | null>>,
  schedules: Schedule[];
  setPreviousSchedule: React.Dispatch<SetStateAction<Schedule>>,
  createEdit: CREATE_UPDATE,
  setCreateEdit: React.Dispatch<SetStateAction<CREATE_UPDATE>>,
  date: Dayjs | null,
  setDate: React.Dispatch<SetStateAction<Dayjs | null>>
  resetWorkspace: Function
}

const GetStarted = (props: GetStartedProps) => {
  const { createEdit, setCreateEdit, date, setDate, resetWorkspace } = props;
  const { schedules, setPreviousSchedule } = props;
  const [templateId, setTemplateId] = useState<string>('');
  const [period, setPeriod] = useState(-1);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const API = generateClient({ authMode: 'apiKey' });
  const periodsOptions = [2, 3, 4, 5, 6, 7, 8];
  const [continueEditing, setContinueEditing] = useState<Schedule | null>(null);
  const [continueEditingLabel, setContinueEditingLabel] = useState<string>("");


  useEffect(() => {
    setSubmitEnabled(isSubmitEnabled())
  }, [date, templateId, period, createEdit])

  useEffect(() => {
    const working = schedules.find((schedule) => schedule.date.includes("WORKING"))
    if (working) {
      setContinueEditing(working);
      const workingData = working.date.split("_");
      if (workingData.length == 3) {
        const type = workingData[1] == "edit" ? "editing" : "creating previous";
        setContinueEditingLabel(`Continue ${type} schedule ${workingData[1] == "template" ? 'from template ' : ''} ${workingData[2]}`)
      }

    }
  }, [schedules])

  async function createSchedule() {
    let existingSchedule: Schedule | undefined = undefined;
    const data: Schedule = {
      date: `WORKING_${createEdit}_${createEdit == CREATE_UPDATE.EDIT ? date?.format("MM/DD/YYYY") : templateId}`,
    };
    if (createEdit == CREATE_UPDATE.CREATE) {
      data.periods = period;
    } else {
      existingSchedule = schedules.find((schedule) => date ? schedule.date == date.format('MM/DD/YYYY') : schedule.id == templateId)
      data.periods = existingSchedule?.periods ?? 6;
    }
    let schedule = await API.graphql({
      query: createScheduleMutation,
      variables: { input: data },
    });

    //set up the schedule entries
    if (existingSchedule) {
      const result = await Promise.all((existingSchedule.entries.items.map((entry) => {
        return createScheduleEntry(entry, schedule.data.createSchedule.id)
      })))
      if (result?.length > 0) {
        await Promise.all(existingSchedule.entries.items.map((entry) => {
          entry.activities?.items?.map((activity) => {
            const correspondingNewEntry = result.find((newEntry) => {
              return newEntry?.data?.createScheduleEntry?.division == entry.division && newEntry?.data?.createScheduleEntry?.period == entry.period
            });
            if (correspondingNewEntry) {
              return createScheduleEntryActivityRelation(correspondingNewEntry.data.createScheduleEntry.id, activity?.activity?.id, activity.label);
            }
          })
        }))
      }
    }

    if (existingSchedule && createEdit == CREATE_UPDATE.EDIT) {
      setPreviousSchedule(existingSchedule);
    }
    schedule = await API.graphql({
      query: getSchedule,
      variables: { id: schedule.data.createSchedule.id },
    });
    return schedule;
  }

  async function createScheduleEntry(input, scheduleId) {
    const data = {
      period: input.period,
      division: input.division,
      scheduleEntriesId: scheduleId,
    }
    return await API.graphql({
      query: createScheduleEntryMutation,
      variables: { input: data },
    });
  }

  async function createScheduleEntryActivityRelation(entryId, activityId, label) {
    const data = {
      scheduleEntryActivitiesId: entryId,
      activityScheduleEntriesId: activityId,
      label: label,
    }
    return await API.graphql({
      query: createActivityScheduleEntryMutation,
      variables: { input: data },
    });
  }

  async function handleGetStarted() {
    if (continueEditing && createEdit !== CREATE_UPDATE.CONTINUE) {
      if (window.confirm("This action will overwrite the schedule you were previously editing. It is recommended that you go back and save that one before continuing. Are you sure you want to continue?")) {
        await resetWorkspace();
        createSchedule().then((value) => {
          props.setSchedule(value.data.getSchedule)
        })
      }
    } else if (createEdit !== CREATE_UPDATE.CONTINUE) {
      createSchedule().then((value) => {
        props.setSchedule(value.data.getSchedule)
      })
    } else {
      const workingDateParts = continueEditing.date.split("_")
      if (workingDateParts.length >= 3) {
        setDate(dayjs(workingDateParts[2]))
        let existingSchedule = schedules.find((s) => s.date == workingDateParts[2])
        setPreviousSchedule(existingSchedule)
      }
      props.setSchedule(continueEditing)
    }
  }

  const isSubmitEnabled = () => {
    if (createEdit == CREATE_UPDATE.CREATE) {
      return period > 0;
    }
    else if (createEdit == CREATE_UPDATE.TEMPLATE) {
      return templateId != "";
    }
    else {
      return date != null && schedules.find((schedule => schedule.date == date.format('MM/DD/YYYY'))) != undefined
    }
  }

  const disableDate = (date: Dayjs) => {
    return schedules.find((schedule => schedule.date == date.format('MM/DD/YYYY'))) == undefined
  }

  return (
    <div className="m-4">
      <Heading level={3}>Get Started</Heading>
      <Flex direction="column" justifyContent="center">
        <RadioGroup value={createEdit} name="createEdit" onChange={(event) => setCreateEdit(event?.target.value as CREATE_UPDATE)}>
          {continueEditing && (
            <FormControlLabel value={CREATE_UPDATE.CONTINUE} control={<Radio />} label={continueEditingLabel} />
          )}
          <FormControlLabel value={CREATE_UPDATE.CREATE} control={<Radio />} label="Create New Schedule" />
          <FormControlLabel value={CREATE_UPDATE.TEMPLATE} control={<Radio />} label="Start from a Template" />
          <FormControlLabel value={CREATE_UPDATE.EDIT} control={<Radio />} label="Edit Existing" />
        </RadioGroup>
        {createEdit == CREATE_UPDATE.CREATE && (
          <>
            <InputLabel>Number of Periods</InputLabel>
            <Select name="numPeriods" defaultValue={6} value={period} onChange={(event) => setPeriod(event.target.value as number)}>
              {periodsOptions.map((i) => {
                return (
                  <MenuItem value={i} key={i}>{i}</MenuItem>
                )
              })
              }
            </Select>
          </>
        )}
        {createEdit == CREATE_UPDATE.TEMPLATE && (
          <>
            <InputLabel>Choose an existing schedule to use as a template</InputLabel>
            <Select name="template" value={templateId} defaultValue='' onChange={(event) => setTemplateId(event.target.value as string)}>
              {schedules.map((schedule, i) => {
                return (
                  <MenuItem value={schedule.id} key={i}>{schedule.date}</MenuItem>
                )
              })}
            </Select>
          </>
        )}
        {createEdit == CREATE_UPDATE.EDIT && (
          <>
            <InputLabel>Choose a date to edit the schedule for</InputLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Date" name="date" value={date} onChange={(value) => setDate(value)} disablePast shouldDisableDate={disableDate} />
            </LocalizationProvider>
          </>
        )}
        {createEdit == CREATE_UPDATE.CONTINUE ? 
          <Button onClick={handleGetStarted} variant="contained">Continue</Button>
          : <Button onClick={handleGetStarted} disabled={!submitEnabled} variant="contained">
            {createEdit == CREATE_UPDATE.EDIT ? "Edit" : "Create"}
          </Button>
        }
      </Flex>
    </div>
  )
}

export default GetStarted;