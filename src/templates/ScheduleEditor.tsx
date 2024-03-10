import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  View,
  withAuthenticator,
  SelectField,
  SliderField
} from "@aws-amplify/ui-react";
import { listActivities, listFacilities, listScheduleEntries } from "../graphql/queries";
import { listActivitiesWithFacilityData } from "../graphql/custom-queries";
import {
  createFacility as createFacilityMutation,
  deleteFacility as deleteFacilityMutation,
  createActivity as createActivityMutation,
  deleteActivity as deleteActivityMutation,
} from "../graphql/mutations";
import { DIVISIONS, Facility as FacilityType, Activity, ScheduleEntry } from "../types";

const ScheduleEditor = () => {
  const [facilities, setFacilities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [scheduleEntriesByPeriod, setScheduleEntries] = useState([]);
  const numPeriods = 6;

  const API = generateClient();

  useEffect(() => {
    fetchFacilities();
    fetchActivities();
    fetchScheduleEntries();
  }, []);

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

  async function fetchScheduleEntries() {
    const apiData = await API.graphql({ query: listScheduleEntries });
    const scheduleFromAPI = apiData.data.listScheduleEntries.items;
    const sortedSchedule = scheduleFromAPI.reduce((accumulator, currentValue) => {
      const period = currentValue.period;
      if (accumulator[period]) {
        accumulator[period].push(currentValue)
      } else {
        accumulator[period] = [currentValue]
      }
      return accumulator;
    }, [])
    sortedSchedule.map((list) => {
      return list.sort((a, b) => a.division < b.divison)
    })
    setScheduleEntries(sortedSchedule);
  }

  function facilityUsageForPeriod(period) {
    const entries: ScheduleEntry[] = scheduleEntriesByPeriod[period];
    const allActivitiesInUse = []
    entries.forEach((entry: ScheduleEntry) => allActivitiesInUse.concat(entry.activities));
    const facilitiesWithUsages = allActivitiesInUse.reduce((accumulator, currentValue: Activity) => {
      if (accumulator[currentValue.facility.id]) {
        accumulator[currentValue.facility.id] += currentValue.usage;
      } else {
        accumulator[currentValue.facility.id] = currentValue.usage;
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

  return (
    <View>
      <Table>
        <TableHead>
          <TableRow>
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
          {tableRows().map((row: ScheduleEntry[]) => {
            return (
              <TableRow>
                {row.map((entry: ScheduleEntry) => {
                  return <TableCell>{entry.period} {entry.division}</TableCell>
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </View>
  );
};

export default ScheduleEditor;