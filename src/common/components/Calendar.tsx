import React, { useEffect, useMemo, useState } from "react";
import { Calendar as ReactCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import '../../App.css';
import dayjs from "dayjs";
import { CREATE_UPDATE, EventType } from "../../types";
import { Button, Modal } from "@mui/material";
import classNames from "classnames";

type CalendarProps = {
  events: EventType[],
  enableEdit: boolean,
  eventComponentStyles: any,
  modalComponent: any,
  modalComponentProps: any,
  onFormSubmit: Function,
  createButtonText?: string
}

const Calendar = (props: CalendarProps) => {
  const { events, enableEdit, eventComponentStyles, modalComponent, onFormSubmit, createButtonText, modalComponentProps } = props;
  const localizer = momentLocalizer(moment)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventMode, setEventMode] = useState<CREATE_UPDATE>(CREATE_UPDATE.CREATE);

  const onClose = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  }

  function EventWrapper({ event }) {
    return (
      <span key={event.id} className={classNames(eventComponentStyles, event.classNames)} onClick={() => onSelectEvent(event)}>
        <strong>{event.title}</strong>
      </span>
    )
  }

  const components = useMemo(() => (
    {
      eventWrapper: EventWrapper,
      agenda: {
        event: EventWrapper,
      }
    }
  ), [])

  const onSelectEvent = (event: any) => {
    if (!enableEdit) {
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

  const handleOpenForCreate = () => {
    setEventMode(CREATE_UPDATE.CREATE);
    setModalOpen(true);
  }

  return (
    <div className="relative h-full">
      {modalOpen && (
        <Modal open={modalOpen}>
          <div className="flex w-full h-full absolute top-0 left-0 overflow-scroll">
            <div className="flex flex-col bg-white rounded p-4 gap-4 my-auto mx-auto w-[90%] sm:w-1/2">
              {modalComponent({ ...modalComponentProps, eventData: selectedEvent, mode: eventMode, setSelectedEvent: setSelectedEvent })}
              <div className="mt-auto flex gap-4 justify-end">
                <Button onClick={() => onClose()} variant="outlined">Cancel</Button>
                <Button variant="contained" onClick={() => {
                  onFormSubmit(selectedEvent, eventMode);
                  setModalOpen(false);
                  setSelectedEvent(null);
                }}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Modal>
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
      {enableEdit && (
        <div className="sm:absolute sm:right-0 sm:top-0 py-4 sm:p-0">
          <Button variant="contained" onClick={handleOpenForCreate}>{createButtonText ?? '+Add Event'}</Button>
        </div>
      )}
    </div>
  )
}

export default Calendar;