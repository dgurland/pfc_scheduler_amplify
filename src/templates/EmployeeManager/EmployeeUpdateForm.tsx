import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CREATE_UPDATE, EventType } from "../../types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MenuItem, Select } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

type EmployeeUpdateFormProps = {
  eventData?: EventType,
  setSelectedEvent: Dispatch<SetStateAction<EventType>>
  mode: CREATE_UPDATE,
  employees: any[];
}
const EmployeeUpdateForm = (props: EmployeeUpdateFormProps) => {
  const { eventData, setSelectedEvent, mode, employees} = props;

  const disableDate = (date: Dayjs) => {
    return employees.find((e) => e.id === eventData?.employeeId)?.daysOff.includes(date.format("MM/DD/YYYY"));
  }

  return (
    <div className="flex flex-col gap-4">
      <span>{mode == CREATE_UPDATE.CREATE ? `Add Day Off` : `Update Date for ${eventData.name}'s Day Off`}</span>
      {mode == CREATE_UPDATE.CREATE && (
        <Select label="Counselor" value={eventData?.employeeId} onChange={(event) => setSelectedEvent({...eventData, employeeId: event.target.value})}>
          {employees.map((employee) => {
            return (
              <MenuItem value={employee.id}>{employee.name}</MenuItem>
            )
          })}
        </Select>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker disabled={!eventData?.employeeId} key={"date"} label="Date" name="date" value={eventData?.date} onChange={(event) => setSelectedEvent({...eventData, date: event})} disablePast shouldDisableDate={disableDate} />
      </LocalizationProvider>
    </div>
  )
}

export default EmployeeUpdateForm;