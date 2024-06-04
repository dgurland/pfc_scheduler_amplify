import React, { useEffect, useMemo, useState } from "react";
import '../../App.css';
import { generateClient } from "aws-amplify/api";
import { listCalendarEvents } from "../../graphql/queries";
import dayjs from "dayjs";
import classNames from 'classnames';
import { CREATE_UPDATE, EventType } from "../../types";
import { Button } from "@mui/material";
import { createCalendarEvent, updateCalendarEvent } from "../../graphql/mutations";
import Calendar from "../../common/components/Calendar";
import EventForm from "./EventForm";

const EventsCalendar = (props: { isAdmin?: boolean }) => {
  const { isAdmin } = props;
  const API = generateClient({ authMode: 'apiKey' });
  const [events, setEvents] = useState<any[]>([]);

  const bgColorsByEventType = [
    'bg-black',
    'bg-green',
    'bg-blue-100',
    'bg-gold-200',
    'bg-gray'
  ]
  const eventTypes = [
    'Other',
    'Grove Pizza',
    'Grove Breakfast',
    'Overnights',
    'OD'
  ]
  const keyClasses = "flex rounded-full w-[24px] h-[24px]"

  async function fetchEvents() {
    const apiData = await API.graphql({ query: listCalendarEvents });
    const eventsFromAPI = apiData.data.listCalendarEvents.items;
    setEvents(eventsFromAPI?.map((event) => {
      let classes = [bgColorsByEventType[event.category ?? 0]]
      if (dayjs().diff(dayjs(event.updatedAt), 'day') <= 1) {
        classes = classes.concat(['border-[3px]', 'border-red'])
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

  async function updateEvent(event: EventType) {
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

  async function createEvent(event: EventType) {
    const eventData = {
      title: event.name,
      date: dayjs(event.date).format("MM/DD/YYYY"),
      category: event.category
    }
    await API.graphql({
      query: createCalendarEvent,
      variables: {
        input: { ...eventData },
      },
    });
  }

  async function onFormSubmit(event: EventType, eventMode: CREATE_UPDATE) {
    if (eventMode == CREATE_UPDATE.CREATE) {
      await createEvent(event);
    } else {
      await updateEvent(event);
    }
    fetchEvents();
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div className="p-4 h-[90vh]">
      <Calendar
        events={events}
        enableEdit={isAdmin}
        eventComponentStyles="my-[1px] flex w-full text-white rounded p-1 text-xs border"
        modalComponent={EventForm}
        onFormSubmit={onFormSubmit}
        modalComponentProps={{}}
      />
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
          <span className={classNames(keyClasses, "border border-4 border-red")} />
          <span>indicates a recent change to this event</span>
        </div>
      </div>
    </div>
  )
}

export default EventsCalendar;