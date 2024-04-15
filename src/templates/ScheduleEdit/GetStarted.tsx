import React, { useState, useEffect, SetStateAction } from "react";
import { RadioGroup, FormControlLabel, Radio, InputLabel, Select, Button } from "@mui/material";
import { Schedule, CREATE_UPDATE } from "../../types";
import {
  View,
  Heading,
  Flex
} from "@aws-amplify/ui-react";
import { DatePicker } from "@mui/x-date-pickers";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "../../App.css";
import { Dayjs } from "dayjs";
import {
  createSchedule as createScheduleMutation,
  createActivityScheduleEntry as createActivityScheduleEntryMutation,
} from "../../graphql/mutations";
import {
  createScheduleEntry as createScheduleEntryMutation
} from "../../graphql/custom-mutations";
import { listSchedules } from "../../graphql/custom-queries";

type GetStartedProps = {
  setSchedule: React.Dispatch<SetStateAction<Schedule | null>>,
  schedules: Schedule[];
  setPreviousScheduleId: React.Dispatch<SetStateAction<string>>
}

const GetStarted = (props: GetStartedProps) => {
  const { schedules, setPreviousScheduleId } = props;
  const [createEdit, setCreateOrEdit] = useState<CREATE_UPDATE>(CREATE_UPDATE.CREATE);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [templateId, setTemplateId] = useState<string>('');
  const [period, setPeriod] = useState(-1);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const API = generateClient({ authMode: 'apiKey' });

  useEffect(() => {
    setSubmitEnabled(isSubmitEnabled())
  }, [date, templateId, period, createEdit])

  async function createSchedule() {
    let existingSchedule: Schedule | undefined = undefined;
    const data: Schedule = {
      date: "WORKING",
    };
    if (createEdit == CREATE_UPDATE.CREATE) {
      data.periods = period;
    } else {
      existingSchedule = schedules.find((schedule) => date ? schedule.date == date.format('MM/DD/YYYY') : schedule.id == templateId)
      data.periods = existingSchedule?.periods ?? 6;
    }
    const schedule = await API.graphql({
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
      setPreviousScheduleId(existingSchedule.id);
    }

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

  const handleGetStarted = () => {
    createSchedule().then((value) => {
      props.setSchedule(value.data.createSchedule)
    })
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
        <RadioGroup value={createEdit} name="createEdit" onChange={(event) => setCreateOrEdit(event?.target.value as CREATE_UPDATE)}>
          <FormControlLabel value={CREATE_UPDATE.CREATE} control={<Radio />} label="Create New Schedule" />
          <FormControlLabel value={CREATE_UPDATE.TEMPLATE} control={<Radio />} label="Start from a Template" />
          <FormControlLabel value={CREATE_UPDATE.EDIT} control={<Radio />} label="Edit Existing" />
        </RadioGroup>
        {createEdit == CREATE_UPDATE.CREATE && (
          <>
            <InputLabel>Number of Periods</InputLabel>
            <Select name="numPeriods" defaultValue={6} value={period} onChange={(event) => setPeriod(event.target.value as number)}>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
            </Select>
          </>
        )}
        {createEdit == CREATE_UPDATE.TEMPLATE && (
          <>
            <InputLabel>Choose an existing schedule to use as a template</InputLabel>
            <Select name="template" value={templateId} defaultValue='' onChange={(event) => setTemplateId(event.target.value as string)}>
              {schedules.map((schedule) => {
                return (
                  <option value={schedule.id}>{schedule.date}</option>
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
        <Button onClick={handleGetStarted} disabled={!submitEnabled} variant="contained">
          {createEdit == CREATE_UPDATE.EDIT ? "Edit" : "Create"}
        </Button>
      </Flex>
    </div>
  )
}

export default GetStarted;