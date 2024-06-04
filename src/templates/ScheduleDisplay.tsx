import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import "../App.css";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  View,
  Heading
} from "@aws-amplify/ui-react";
import { DIVISIONS, Facility as FacilityType, Activity, ScheduleEntry, Schedule, Facility } from "../types";
import { facilityUsageForPeriod, organizeTableEntries } from "../common/helpers";
import { MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import classNames from "classnames";
import { Switch } from '@mui/material';
import { listActivitiesWithFacilityData } from "../graphql/custom-queries";
import { listFacilities } from "../graphql/queries";

type ScheduleDisplayProps = {
  schedule?: Schedule;
  defaultDivision?: DIVISIONS;
  defaultActivities: string[];
}

const ScheduleDisplay = (props: ScheduleDisplayProps) => {
  const { defaultDivision, defaultActivities, schedule } = props;
  const [scheduleEntriesByPeriod, setScheduleEntries] = useState<ScheduleEntry[][]>([]);
  const numPeriods = schedule?.periods;
  const [filterFormat, setFilterFormat] = useState(defaultActivities?.length > 0 ?? false);
  const API = generateClient({ authMode: 'apiKey' });
  const [divisionForMobile, setDivisionForMobile] = useState<DIVISIONS | "available" | undefined>(defaultDivision ?? DIVISIONS.JRG);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(defaultActivities);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    setScheduleEntries(organizeTableEntries(props.schedule?.entries?.items));
  }, [props.schedule]);

  useEffect(() => {
    fetchActivities();
    fetchFacilities();
  }, [])

  useEffect(() => {
    setDivisionForMobile(defaultDivision != undefined ? defaultDivision : DIVISIONS.JRG);
  }, [defaultDivision]);

  useEffect(() => {
    setSelectedActivities(defaultActivities);
    setFilterFormat(defaultActivities?.length > 0 ?? false)
  }, [defaultActivities]);

  async function fetchActivities() {
    const apiData = await API.graphql({ query: listActivitiesWithFacilityData });
    const activitiesFromAPI = apiData.data.listActivities.items;
    setAllActivities(activitiesFromAPI);
  }

  async function fetchFacilities() {
    const apiData = await API.graphql({ query: listFacilities });
    const facilitiesFromAPI = apiData.data.listFacilities.items;
    setFacilities(facilitiesFromAPI);
  }

  const tableRows = (): ScheduleEntry[][] => {
    let rows: ScheduleEntry[][] = []
    const divisions = Object.keys(DIVISIONS).filter((key) => isNaN(Number(key)));
    for (let i = 0; i < numPeriods; i++) {
      const row = [];
      const dataForPeriod: ScheduleEntry[] = scheduleEntriesByPeriod[i] ?? [];
      if (!filterFormat) {
        for (let j = 0; j < divisions.length; j++) {
          let divisionData = dataForPeriod.find((dataEntry) => dataEntry.division == j);
          if (divisionData) {
            row[j] = divisionData;
          } else {
            row[j] = {
              id: "",
              activities: [],
              period: i,
              division: j
            };
          }
        }
      } else {
        const divisionsToInclude = []
        dataForPeriod.forEach((dataEntry) => {
          dataEntry?.activities?.items?.forEach((item) => {
            if (item.activity?.id && selectedActivities?.includes(item.activity.id)) {
              let divisionString = DIVISIONS[dataEntry.division]
              if (selectedActivities.length > 1) {
                divisionString = divisionString + ` (${allActivities.find((activity) => activity.id === item.activity?.id)?.name})`
              }
              divisionsToInclude.push(divisionString)
            }
          })
        })
        row[0] = {
          period: i,
          activities: divisionsToInclude
        }
      }

      rows.push(row)
    }
    return rows;
  }

  if (!props.schedule) {
    return (
      <div>No upcoming schedules to show</div>
    )
  }

  return (
    <div className="flex flex-col">
      {!filterFormat && (<div className="sm:hidden w-full my-2 px-4 container">
        <Select value={divisionForMobile} key={"divisions"}
          onChange={(event) => setDivisionForMobile(event?.target.value as DIVISIONS)}
          classes={{
            root: "w-full h-[50%]"
          }}
        >
          {Object.keys(DIVISIONS).filter((key) => isNaN(Number(key))).map((divisionKey) => {
            return (
              <MenuItem value={DIVISIONS[divisionKey]} key={divisionKey}>{divisionKey}</MenuItem>
            )
          })}
          <MenuItem value={undefined} key={"all"}>Show all</MenuItem>
          <MenuItem value={"available"} key={"all"}>Show available facilities</MenuItem>
        </Select>
      </div>)}
      {filterFormat && (<div className="sm:hidden w-full sm:w-auto sm:order-2 my-2 px-4 container">
        <Select multiple value={selectedActivities} key={"activities"}
          onChange={(event) => {
            setSelectedActivities(event.target.value)
          }}
          classes={{
            root: "w-full"
          }}
        >
          {allActivities.map((activity, i) => {
            return (
              <MenuItem value={activity.id} key={`activity-${i}`}>{activity.name}</MenuItem>
            )
          })}
        </Select>
      </div>)}
      <div className={classNames("p-2 sm:block sm:w-2/3 mx-auto sm:order-2", {"hidden": divisionForMobile != "available"})}>
        <strong>*DISCLAIMER:</strong> Specialists are not expected to be available when they are not scheduled to work.
        When using these available areas, the division leader is responsible for enforcing any safety rules and planning an activity for their group.
        <strong> Please leave the area in the same condition that you find it in.</strong>
      </div>
      <div className="m-4 font-bold text-xl">
        {dayjs().isSame(dayjs(props.schedule?.date, "MM/DD/YYYY"), 'day') ? <span>Today's Schedule</span> : <span>Schedule For {props.schedule?.date}</span>}
      </div>
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {!filterFormat ?
                <>
                  {Object.keys(DIVISIONS).filter((key) => isNaN(Number(key))).map((divisionKey) => {
                    return (
                      <TableCell key={divisionKey} className={classNames("sm:flex", { "hidden": divisionForMobile !== undefined && divisionForMobile !== DIVISIONS[divisionKey] })}>{divisionKey}</TableCell>
                    )
                  }
                  )}
                  <TableCell key={"available"} className={classNames("sm:flex", { "hidden": divisionForMobile !== undefined && divisionForMobile !== "available" })}>Available Facilities*</TableCell>
                </> : <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows().map((row: ScheduleEntry[], i) => {
              const usageForPeriod = Object.keys(facilityUsageForPeriod(i, scheduleEntriesByPeriod, allActivities));
              return (
                <TableRow key={i}>
                  <TableCell key={`period-${i}`} className="!left-0 !sticky !bg-white">
                    {schedule?.periodNames?.length > i && schedule.periodNames[i] ?  schedule.periodNames[i] : `Period ${i+1}`}
                  </TableCell>
                  {row.map((entry: ScheduleEntry, j) => {
                    if (!filterFormat) {
                      return (
                        <TableCell key={`${i}-${j}-division`} className={classNames("sm:flex", { "hidden": divisionForMobile !== undefined && divisionForMobile !== j })}>
                          {[...new Set(entry.activities?.items?.map((activity) => `${activity.activity.name}${activity.label ? " (" + activity.label + ")" : ''}`))].join(', ')}
                        </TableCell>
                      )
                    } else {
                      return (
                        <TableCell key={`${i}-${j}-activity`} className={classNames("sm:flex")}>
                          {entry.activities.join(', ')}
                        </TableCell>
                      )
                    }
                  })}
                  <TableCell key={`${i}-available`} className={classNames("sm:flex", { "hidden": filterFormat || (divisionForMobile !== undefined && divisionForMobile !== "available") })}>
                    {facilities.filter((facility) => !usageForPeriod.includes(facility.name)).map((facility) => facility.name).join(', ')}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="ml-auto p-2">
        by division<Switch checked={filterFormat} onChange={(event) => setFilterFormat(event.target.checked)}></Switch>by activity area
      </div>
    </div>
  );
};

export default ScheduleDisplay;