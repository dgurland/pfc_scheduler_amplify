import React, { useEffect, useMemo, useState } from "react";
import { Calendar as ReactCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import '../App.css';
import { generateClient } from "aws-amplify/api";
import { listCalendarEvents } from "../graphql/queries";
import dayjs from "dayjs";
import classNames from 'classnames';

const Calendar = () => {
  const localizer = momentLocalizer(moment)
  const API = generateClient({ authMode: 'apiKey' });
  const [events, setEvents] = useState<any[]>([]);
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
        id: event.id
      })
    }))
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
    console.log(event);
  }

  function EventWrapper({ event }) {
    return (
      <span key={event.id} className={classNames("flex w-full text-white rounded p-2 border", event.classNames)}>
        <strong>{event.title}</strong>
      </span>
    )
  }

  return (
    <div className="p-4 h-[90vh]">
      <div className="hidden sm:block h-full">
        <ReactCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={onSelectEvent}
          views={['month']}
          components={components}
        />
      </div>
      <div className="sm:hidden h-full">
        <ReactCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={onSelectEvent}
          defaultView='agenda'
          views={['month', 'agenda']}
          components={components}
        />
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