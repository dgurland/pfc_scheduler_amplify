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
  deleteSchedule as deleteScheduleMutation
} from "../../graphql/mutations";

const ScheduleEditLayout = () => {
  const [facilities, setFacilities] = useState([]);
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [previousScheduleId, setPreviousScheduleId] = useState("");
  const [activities, setActivities] = useState([]);
  const [scheduleEntriesByPeriod, setScheduleEntries] = useState<ScheduleEntry[][]>([]);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [createEdit, setCreateOrEdit] = useState<CREATE_UPDATE>(CREATE_UPDATE.CREATE);

  const API = generateClient({ authMode: 'apiKey' });

  useEffect(() => {
    fetchFacilities();
    fetchActivities();
    if (!schedule) {
      resetWorkspace().then(() => fetchExistingSchedules())
    }
    else {
      fetchExistingSchedules();
    }
    // API.graphql({ query: getSchedule, variables: {id: 'cfe7afe4-d917-43b9-ae6e-42949d62ccf5'}}).then((result) => {
    //   setSchedule(result.data.getSchedule)
    // }) //TODO: remove this (temp for testing)
  }, []);

  useEffect(() => {
    if (schedule) {
      const sortedSchedule = organizeTableEntries(schedule.entries?.items);
      setScheduleEntries(sortedSchedule);
    }
  }, [schedule])

  async function resetWorkspace() {
    const data = await API.graphql({ query: listSchedules, variables: { filter: { date: { eq: "WORKING" } } } })
    if (!((data?.data?.listSchedules?.items ?? []).length > 0)) {
      return;
    }
    const workingSchedule = data.data.listSchedules.items[0];
    return await API.graphql({
      query: deleteScheduleMutation,
      variables: {
        input: {
          id: workingSchedule.id
        },
      },
    });
  }

  async function afterActivitySubmit() {
    API.graphql({ query: getSchedule, variables: {id: 'cfe7afe4-d917-43b9-ae6e-42949d62ccf5'}}).then((result) => {
      setSchedule(result.data.getSchedule)
    }) //TODO: remove this (temp for testing)
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

  const disableGetStarted = () => {
    
  }

  async function resetEditor() {
    setSchedule(null);
  }

  return (
    <>
      {schedule ?
        <Editor 
          scheduleEntriesByPeriod={scheduleEntriesByPeriod}
          activities={activities}
          numPeriods={schedule.periods}
          afterActivitySubmit={afterActivitySubmit}
          scheduleId={schedule?.id}
          editingType={createEdit}
          date={date ?? null}
          schedules={schedules}
          previousScheduleId={previousScheduleId}
          resetEditor={resetEditor}
          />
        :
        <GetStarted setSchedule={setSchedule} schedules={schedules} setPreviousScheduleId={setPreviousScheduleId} />
      }
    </>
  );
};

export default ScheduleEditLayout;