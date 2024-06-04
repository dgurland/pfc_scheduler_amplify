import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import "../../App.css";
import { listFacilities } from "../../graphql/queries";
import { listSchedules } from "../../graphql/custom-queries";
import { listActivitiesWithFacilityData, getSchedule } from "../../graphql/custom-queries";
import { DIVISIONS, Facility as FacilityType, Activity, ScheduleEntry, Schedule, CREATE_UPDATE } from "../../types";
import { Dayjs } from "dayjs";
import { organizeTableEntries } from "../../common/helpers";
import GetStarted from "./GetStarted";
import Editor from "./Editor";
import {
  deleteActivityScheduleEntry,
  deleteScheduleEntry,
  deleteSchedule as deleteScheduleMutation
} from "../../graphql/mutations";

const ScheduleEditLayout = () => {
  const [facilities, setFacilities] = useState([]);
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [previousSchedule, setPreviousSchedule] = useState("");
  const [activities, setActivities] = useState([]);
  const [scheduleEntriesByPeriod, setScheduleEntries] = useState<ScheduleEntry[][]>([]);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [createEdit, setCreateOrEdit] = useState<CREATE_UPDATE>(CREATE_UPDATE.CREATE);

  const API = generateClient({ authMode: 'apiKey' });

  useEffect(() => {
    fetchFacilities();
    fetchActivities();
    fetchExistingSchedules();
  }, []);

  useEffect(() => {
    if (schedule) {
      const sortedSchedule = organizeTableEntries(schedule.entries?.items);
      setScheduleEntries(sortedSchedule);
    }
  }, [schedule])

  async function afterActivitySubmit() {
    API.graphql({ query: getSchedule, variables: { id: schedule?.id } }).then((result) => {
      setSchedule(result.data.getSchedule)
    })
  }

  async function fetchExistingSchedules() {
    const apiData = await API.graphql({ query: listSchedules });
    const schedulesFromAPI = apiData.data.listSchedules.items;
    setSchedules(schedulesFromAPI);
  }

  async function fetchFacilities() {
    const apiData = await API.graphql({ query: listFacilities });
    const facilitiesFromAPI = apiData.data.listFacilities.items;
    setFacilities(facilitiesFromAPI);
  }

  async function fetchActivities() {
    const apiData = await API.graphql({ query: listActivitiesWithFacilityData });
    const activitiesFromAPI = apiData.data.listActivities.items;
    setActivities(activitiesFromAPI);
  }

  async function resetEditor(shouldReset = true) {
    setSchedule(null);
    setCreateOrEdit(CREATE_UPDATE.CREATE)
    if (shouldReset) await resetWorkspace();
    fetchExistingSchedules();
  }

  async function resetWorkspace() {
    const data = await API.graphql({ query: listSchedules, variables: { filter: { date: { contains: "WORKING" } } } })

    if (!((data?.data?.listSchedules?.items ?? []).length > 0)) {
      return;
    }
    const workingSchedule = data.data.listSchedules.items[0];
    await Promise.all(workingSchedule.entries?.items.map((entry) => {
      entry.activities?.items?.map((activityRelation) => {
        return API.graphql({
          query: deleteActivityScheduleEntry,
          variables: { input: { id: activityRelation.id } }
        })
      })
    }))
    await Promise.all(workingSchedule.entries?.items.map((entry) => {
      return API.graphql({
        query: deleteScheduleEntry,
        variables: { input: { id: entry.id } }
      })
    }))
    return await API.graphql({
      query: deleteScheduleMutation,
      variables: {
        input: {
          id: workingSchedule.id
        },
      },
    });
  }

  return (
    <>
      {schedule ?
        <Editor
          scheduleEntriesByPeriod={scheduleEntriesByPeriod}
          activities={activities}
          numPeriods={schedule.periods}
          periodNames={schedule.periodNames}
          afterActivitySubmit={afterActivitySubmit}
          scheduleId={schedule?.id}
          editingType={createEdit}
          date={date ?? null}
          schedules={schedules}
          previousSchedule={previousSchedule}
          resetEditor={resetEditor}
        />
        :
        <GetStarted
          setSchedule={setSchedule}
          schedules={schedules}
          setPreviousSchedule={setPreviousSchedule}
          createEdit={createEdit}
          setCreateEdit={setCreateOrEdit}
          date={date}
          setDate={setDate}
          resetWorkspace={resetWorkspace}
        />
      }
    </>
  );
};

export default ScheduleEditLayout;