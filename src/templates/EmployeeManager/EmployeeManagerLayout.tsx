import React, { useEffect, useState } from "react";
import Calendar from "../../common/components/Calendar";
import { CREATE_UPDATE, EventType } from "../../types"
import { generateClient } from "aws-amplify/api";
import { listEmployees } from "../../graphql/queries";
import EmployeeUpdateForm from "./EmployeeUpdateForm";
import dayjs from "dayjs";
import { updateEmployee } from "../../graphql/mutations";

type EmployeeManagerProps = {
  divisions?: number[];
}

const EmployeeManagerLayout = (props: EmployeeManagerProps) => {
  const { divisions } = props;
  const [events, setEvents] = useState<EventType[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const API = generateClient({ authMode: 'apiKey' });

  async function fetchEvents() {
    const filter = { or: divisions.map((division) => { return { division: { eq: division } } }) }
    const apiData = await API.graphql({ query: listEmployees, variables: { filter: filter } });
    const employeesFromAPI = apiData.data.listEmployees.items;
    setEmployees(employeesFromAPI);
    const eventsFromEmployeeData = []
    employeesFromAPI.forEach((employee) => {
      employee.daysOff?.forEach((day) => {
        eventsFromEmployeeData.push({
          start: new Date(day),
          end: new Date(day),
          allDay: true,
          title: employee.name,
          division: employee.division,
          employeeId: employee.id
        })
      })
    })
    setEvents(eventsFromEmployeeData)
  }

  async function onFormSubmit(event: EventType, eventMode: CREATE_UPDATE) {
    const employee = employees.find((e) => e.id == event.employeeId)
    let newDateList = employee.daysOff ?? [];
    const dateString = dayjs(event.date).format("MM/DD/YYYY");
    newDateList.push(dateString)
    if (eventMode == CREATE_UPDATE.EDIT) {
      newDateList = newDateList.filter((date) => date !== dayjs(event.start).format("MM/DD/YYYY"))
    }
    const dataForUpdate = {
      id: event.employeeId,
      daysOff: newDateList
    }
    await API.graphql({
      query: updateEmployee, variables: {
        input: {
         ...dataForUpdate
        },
      },
    });
    fetchEvents();
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div className="p-4 h-[90vh]">
      <div className="font-bold w-full text-center text-xl">Days Off</div>
      <Calendar
        events={events}
        enableEdit={true}
        eventComponentStyles=""
        modalComponent={EmployeeUpdateForm}
        onFormSubmit={onFormSubmit}
        modalComponentProps={{ employees: employees }}
        createButtonText="+ new"
      />
    </div>
  )
}

export default EmployeeManagerLayout;