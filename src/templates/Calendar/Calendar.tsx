import React, { useEffect, useMemo, useState } from "react";
import { Calendar as ReactCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import '../../App.css';
import { generateClient } from "aws-amplify/api";
import { listCalendarEvents } from "../../graphql/queries";
import dayjs from "dayjs";
import classNames from 'classnames';
import CalendarEventEdit from "./CalendarEventEdit";
import { CREATE_UPDATE, Event } from "../../types";
import { Button } from "@mui/material";
import { createCalendarEvent, updateCalendarEvent } from "../../graphql/mutations";

const Calendar = (props: { isAdmin?: boolean }) => {
  const { isAdmin } = props;
  const localizer = momentLocalizer(moment)
  const API = generateClient({ authMode: 'apiKey' });
  const [events, setEvents] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventMode, setEventMode] = useState<CREATE_UPDATE>(CREATE_UPDATE.CREATE);
  const bgColorsByEventType = [
    'bg-black',
    'bg-green',
    'bg-blue-100',
    'bg-gold-200'
  ]
  const eventTypes = [
    'Other',
    'Overnights',
    'Grove Pizza',
    'Grove Breakfast'
  ]
  const keyClasses = "flex rounded-full w-[24px] h-[24px]"

  async function fetchEvents() {
    const apiData = await API.graphql({ query: listCalendarEvents });
    const eventsFromAPI = apiData.data.listCalendarEvents.items;
    setEvents(eventsFromAPI?.map((event) => {
      let classes = [bgColorsByEventType[event.category ?? 0]]
      if (dayjs(event.updatedAt).diff(dayjs(), 'day') <= 1) {
        classes = classes.concat(['border-2', 'border-red'])
      }
      return ({
        start: new Date(event.date),
        end: new Date(event.date),
        allDay: true,
        title: event.title,
        classNames: classes,
        id: event.id,
        category: event.category
      })
    }))
  }

  async function updateEvent(event: Event) {
    const data = {
      id: event.id,
      title: event.name,
      date: dayjs(event.date).format("MM/DD/YYYY"),
      category: event.category
    }
    await API.graphql({
      query: updateCalendarEvent,
      variables: {
        input: {
          ...data
        },
      },
    });
  }

  async function createEvent(event: Event) {
    const eventData = {
      title: event.name,
      date: dayjs(event.date).format("MM/DD/YYYY"),
      category: event.category
    }
    console.log(eventData)
    await API.graphql({
      query: createCalendarEvent,
      variables: {
        input: { ...eventData },
      },
    });
  }

  async function onFormSubmit(event: Event) {
    if (eventMode == CREATE_UPDATE.CREATE) {
      await createEvent(event);
    } else {
      await updateEvent(event);
    }
    fetchEvents();
    setModalOpen(false);
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  const components = useMemo(() => (
    {
      eventWrapper: EventWrapper,
      agenda: {
        event: EventWrapper,
      }
    }
  ), [])

  const onSelectEvent = (event: any) => {
    console.log(isAdmin)
    if (!isAdmin) {
      return;
    }
    setSelectedEvent({
      ...event,
      name: event.title,
      date: dayjs(event.start),
    });
    setModalOpen(true);
    setEventMode(CREATE_UPDATE.EDIT);
  }

  const onModalClose = (event: any) => {
    setSelectedEvent(null);
    setModalOpen(false);
  }

  const handleOpenForCreate = () => {
    setEventMode(CREATE_UPDATE.CREATE);
    setModalOpen(true);
  }

  function EventWrapper({ event }) {
    return (
      <span key={event.id} className={classNames("flex w-full text-white rounded p-1 text-sm border", event.classNames)} onClick={() => onSelectEvent(event)}>
        <strong>{event.title}</strong>
      </span>
    )
  }

  return (
    <div className="p-4 h-[90vh] relative">
      {modalOpen && (
        <CalendarEventEdit
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          selectedEvent={selectedEvent}
          onClose={onModalClose}
          mode={eventMode}
          handleSubmit={onFormSubmit}
        />
      )}
      <div className="hidden sm:block h-full">
        <ReactCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month']}
          components={components}
        />
      </div>
      <div className="sm:hidden">
        <ReactCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          defaultView='agenda'
          views={['month', 'agenda']}
          components={components}
        />
      </div>
      <div className="sm:absolute sm:right-0 sm:top-0 py-4 sm:p-4">
        <Button variant="contained" onClick={handleOpenForCreate}>+Add Event</Button>
      </div>
      <div className="flex gap-4 flex-wrap w-full py-2">
        <div className="font-bold uppercase">Key</div>
        {eventTypes.map((type, i) => {
          return (
            <div className="flex gap-1" key={type}>
              <span className={classNames(keyClasses, bgColorsByEventType[i])} />
              <span>{type}</span>
            </div>
          )
        })}
        <div className="flex gap-1">
          <span className={classNames(keyClasses, "border border-2 border-red")} />
          <span>indicates a recent change to this event</span>
        </div>
      </div>
    </div>
  )
}

export default Calendar;