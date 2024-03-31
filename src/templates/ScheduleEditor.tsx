import React, { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "../App.css";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  View,
  withAuthenticator,
  SelectField,
  SliderField,
  Heading,
  Flex,
  Button
} from "@aws-amplify/ui-react";
import { listActivities, listFacilities, listScheduleEntries } from "../graphql/queries";
import { listActivitiesWithFacilityData } from "../graphql/custom-queries";
import {
  createScheduleEntry,
  updateScheduleEntry
} from "../graphql/mutations";
import { DIVISIONS, Facility as FacilityType, Activity, ScheduleEntry } from "../types";
import ActivitySelect from "../common/components/ActivitySelect";
import dayjs, { Dayjs } from "dayjs";

const ScheduleEditor = () => {
  const [facilities, setFacilities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [scheduleEntriesByPeriod, setScheduleEntries] = useState<ScheduleEntry[][]>([]);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [datePickerDisabled, setDatePickerDisabled] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const numPeriods = 6;

  const API = generateClient({ authMode: 'apiKey' });

  useEffect(() => {
    fetchFacilities();
    fetchActivities();
    fetchScheduleEntries();
  }, []);

  useEffect(() => {
    fetchScheduleEntries();

    //adds each existing entry to the "working" (dateless) table
    scheduleEntriesByPeriod?.forEach((period) => {
      period?.forEach((entry) => {
        createUpdateScheduleEntry(entry);
      })
    })
  }, [date])

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

  async function scheduleEntriesExistForDate(date: string) {
    const apiData = await API.graphql({ query: listScheduleEntries, variables: { filter: { date: { eq: date ?? '' } } } });
    const scheduleFromAPI = apiData.data.listScheduleEntries.items;
    return scheduleFromAPI?.length > 0;
  }

  async function fetchScheduleEntries() {
    const apiData = await API.graphql({ query: listScheduleEntries, variables: { filter: { date: { eq: date?.format('MM/DD/YYYY') ?? '' } } } });
    const scheduleFromAPI = apiData.data.listScheduleEntries.items;
    let sortedSchedule = scheduleFromAPI.reduce((accumulator, currentValue) => {
      const period = currentValue.period;
      if (accumulator[period]) {
        accumulator[period].push(currentValue)
      } else {
        accumulator[period] = [currentValue]
      }
      return accumulator;
    }, [])
    sortedSchedule = sortedSchedule.map((list: ScheduleEntry[]) => {
      return list.sort((a, b) => a.division > b.division ? 1 : -1)
    })
    setScheduleEntries(sortedSchedule);
  }

  async function saveDateToScheduleEntries(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const newDate = form.get("date") as string;
    if (isCreating) {
      const exists = await scheduleEntriesExistForDate(newDate);
      if (exists) {
        const save = window.confirm("There is already data for this day stored in the system. Saving this schedule could potentially overwrite that. Are you sure you want to continue?");
        if (!save) {
          return;
        }
      }
    }
    setDate(dayjs(newDate, "MM/DD/YYYY"));
    await Promise.all(scheduleEntriesByPeriod.map((period) => {
      return period?.map((entry: ScheduleEntry) => {
        if (entry) {
          return createUpdateScheduleEntry(entry, newDate)
        }
      })
    }))
    fetchScheduleEntries();
    setDatePickerDisabled(false);
    event.target.reset();
  }

  function facilityUsageForPeriod(period) {
    const entries: ScheduleEntry[] = scheduleEntriesByPeriod[period] ?? [];
    const allActivitiesInUse = []
    entries.forEach((entry: ScheduleEntry) => {
      entry.activityIds.forEach((activityId: string) => {
        const activityObj = activities.find((activity: Activity) => activity.id === activityId)
        if (activityObj && !allActivitiesInUse.includes(activityObj)) {
          allActivitiesInUse.push(activityObj);
        }
      })
    });
    const facilitiesWithUsages = allActivitiesInUse.reduce((accumulator, currentValue: Activity) => {
      if (accumulator[currentValue.facility.name]) {
        accumulator[currentValue.facility.name] += currentValue.usage;
      } else {
        accumulator[currentValue.facility.name] = currentValue.usage;
      }
      return accumulator;
    }, {})
    return facilitiesWithUsages;
  }

  const tableRows = (): ScheduleEntry[][] => {
    let row: ScheduleEntry[][] = []
    for (let i = 0; i < numPeriods; i++) {
      row[i] = [];
      const dataForPeriod: ScheduleEntry[] = scheduleEntriesByPeriod[i] ?? [];
      Object.keys(DIVISIONS).filter((key) => isNaN(Number(key))).forEach((divisionKey) => {
        const d = DIVISIONS[divisionKey]
        if (dataForPeriod[d]?.division == d) {
          row[i].push(dataForPeriod[d]);
        } else {
          const dummyEntry: ScheduleEntry = {
            date: "",
            id: "",
            activities: [],
            activityIds: [],
            period: i,
            division: d
          }
          row[i].push(dummyEntry)
        }
      })
    }
    return row;
  }

  async function createUpdateScheduleEntry(entry: ScheduleEntry, date = '') {
    if (entry.id == "" || entry.date || (date && entry.date !== date)) {
      //create
      const data = {
        date: date,
        period: entry.period,
        division: entry.division,
        activityIds: entry.activityIds,
      }
      await API.graphql({
        query: createScheduleEntry,
        variables: { input: data },
      });
    } else {
      //update
      const data = {
        date: date,
        period: entry.period,
        division: entry.division,
        activityIds: entry.activityIds,
        id: entry.id
      }
      await API.graphql({
        query: updateScheduleEntry,
        variables: { input: data },
      });
    }
    fetchScheduleEntries();
  }

  return (
    <View>
      {date ? (
        <Heading level={3}>Editing Schedule for date: {date.format('MM/DD/YYYY')}</Heading>
      ) : (
        <View margin="3rem 0">
          <Heading level={3}>Choose a date to edit an existing schedule:</Heading>
          <Flex direction="row" justifyContent="center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Date" onChange={(value) => {
                setDatePickerDisabled(true);
                setDate(value);
                setIsCreating(false);
              }} />
            </LocalizationProvider>
          </Flex>
        </View>)}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              Jr Girls
            </TableCell>
            <TableCell>
              Int Girls
            </TableCell>
            <TableCell>
              Sr Girls
            </TableCell>
            <TableCell>
              HS Girls
            </TableCell>
            <TableCell>
              Jr Boys
            </TableCell>
            <TableCell>
              Int Boys
            </TableCell>
            <TableCell>
              Sr Boys
            </TableCell>
            <TableCell>
              HS Boys
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows().map((row: ScheduleEntry[], i) => {
            return (
              <TableRow key={i}>
                <TableCell key={`period-${i}`}>
                  Period {i + 1}
                </TableCell>
                {row.map((entry: ScheduleEntry, j) => {
                  return (
                    <TableCell key={`${i}-${j}`}>
                      <ActivitySelect activities={activities} scheduleEntry={entry} onChange={createUpdateScheduleEntry} facilityUsage={facilityUsageForPeriod(i)} />
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <View as="form" margin="3rem 0" onSubmit={saveDateToScheduleEntries}>
        <Heading level={3}>Save Schedule</Heading>
        <Flex direction="row" justifyContent="center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Date" name="date" value={date} disabled={datePickerDisabled} />
          </LocalizationProvider>
          <Button type="submit" variation="primary">
            Save
          </Button>
        </Flex>
      </View>
    </View>
  );
};

export default ScheduleEditor;