import { Button, MenuItem, Modal, Select, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { CREATE_UPDATE, EVENT_CATEGORY, EventType } from "../../types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type EventFormProps = {
  eventData?: EventType,
  setSelectedEvent: Dispatch<SetStateAction<EventType>>
  mode: CREATE_UPDATE,
}

const EventForm = (props: EventFormProps) => {
  const { mode, eventData, setSelectedEvent } = props;

  return (
    <div className="flex flex-col gap-4">
      <span>{mode == CREATE_UPDATE.CREATE ? 'Create Event' : 'Edit Event'}</span>
      <TextField key={"title"} label="Title" value={eventData?.name} onChange={(event) => setSelectedEvent({ ...eventData, name: event.target.value })}></TextField>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker key={"date"} label="Date" name="date" value={eventData?.date} onChange={(d) => setSelectedEvent({ ...eventData, date: d })} disablePast />
      </LocalizationProvider>
      <Select key={"category"} label="Category" value={eventData?.category} onChange={(event) => setSelectedEvent({ ...eventData, category: event.target.value })}>
        {Object.keys(EVENT_CATEGORY).filter((key) => isNaN(Number(key))).map((key) => {
          return (
            <MenuItem value={EVENT_CATEGORY[key]}>{key}</MenuItem>
          )
        })}
      </Select>
    </div>
  )
}

export default EventForm;