import { Button, MenuItem, Modal, Select, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { CREATE_UPDATE, EVENT_CATEGORY } from "../../types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type CalendarEventEditProps = {
  modalOpen: boolean,
  onClose: Function,
  selectedEvent?: Event,
  mode: CREATE_UPDATE,
  handleSubmit: Function,
}

const CalendarEventEdit = (props: CalendarEventEditProps) => {
  const { modalOpen, mode, selectedEvent, onClose, handleSubmit } = props;
  const [eventData, setEventData] = useState<any>({ ...selectedEvent });

  if (!modalOpen) {
    return (<></>)
  }

  return (
    <Modal open={modalOpen}>
      <div className="flex w-full h-full absolute top-0 left-0 overflow-scroll">
        <div className="flex flex-col bg-white rounded p-4 gap-4 my-auto mx-auto w-[90%] sm:w-1/2">
          <div className="flex flex-col gap-4">
            <span>{mode == CREATE_UPDATE.CREATE ? 'Create Event' : 'Edit Event'}</span>
            <TextField key={"title"} label="Title" value={eventData?.name} onChange={(event) => setEventData({ ...eventData, name: event.target.value })}></TextField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker key={"date"} label="Date" name="date" value={eventData?.date} onChange={(d) => setEventData({ ...eventData, date: d })} disablePast />
            </LocalizationProvider>
            <Select key={"category"} label="Category" value={eventData?.category} onChange={(event) => setEventData({ ...eventData, category: event.target.value })}>
              {Object.keys(EVENT_CATEGORY).filter((key) => isNaN(Number(key))).map((key) => {
                return (
                  <MenuItem value={EVENT_CATEGORY[key]}>{key}</MenuItem>
                )
              })}
            </Select>
          </div>
          <div className="mt-auto flex gap-4 justify-end">
            <Button onClick={() => onClose()} variant="outlined">Cancel</Button>
            <Button variant="contained" onClick={() => handleSubmit(eventData)}>Save</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CalendarEventEdit;