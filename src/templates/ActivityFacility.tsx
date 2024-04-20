import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import {
  Flex,
  Heading,
  Text,
  TextField,
  View,
  withAuthenticator,
  SelectField,
  SliderField,
  Table,
  TableRow,
  TableHead,
  TableCell
} from "@aws-amplify/ui-react";
import { listActivities, listFacilities } from "../graphql/queries";
import { listActivitiesWithFacilityData } from "../graphql/custom-queries";
import {
  createFacility as createFacilityMutation,
  deleteFacility as deleteFacilityMutation,
  createActivity as createActivityMutation,
  deleteActivity as deleteActivityMutation,
  deleteActivityScheduleEntry,
} from "../graphql/mutations";
import { Button, Tab, Tabs, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";

const ActivityFacility = () => {
  const [facilities, setFacilities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tab, setTab] = useState(0);

  const API = generateClient();

  useEffect(() => {
    fetchFacilities();
    fetchActivities();
    console.log(activities);
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

  async function createFacility(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
    };
    await API.graphql({
      query: createFacilityMutation,
      variables: { input: data },
    });
    fetchFacilities();
    event.target.reset();
  }

  async function createActivity(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      usage: form.get("usage"),
      facilityId: form.get("facility")
    };
    await API.graphql({
      query: createActivityMutation,
      variables: { input: data },
    });
    fetchActivities();
    event.target.reset();
  }

  async function deleteFacility({ id }) {
    if (window.confirm("Are you sure you want to delete this facility? This cannot be undone.")) {
      const newFacilities = facilities.filter((facility) => facility.id !== id);
      setFacilities(newFacilities);
      await API.graphql({
        query: deleteFacilityMutation,
        variables: { input: { id } },
      });
    }
  }

  async function deleteActivity({ id, scheduleEntries }) {
    let confirmMessage = "";
    const futureSchedules = scheduleEntries?.items?.filter((scheduleEntry) => {
      return scheduleEntry?.scheduleEntry?.schedule?.date ? dayjs().isSame(dayjs(scheduleEntry.scheduleEntry.schedule.date, "MM/DD/YYYY"), "day") || dayjs().isBefore(dayjs(scheduleEntry.scheduleEntry.schedule.date, "MM/DD/YYYY")) : false;
    })
    if (futureSchedules?.length > 0) {
      confirmMessage = `Are you sure you want to delete this activity? It appears ${futureSchedules.length} times in upcoming schedules that it will be removed from.`
    } else {
      confirmMessage = "Are you sure you want to delete this activity? This cannot be undone."
    }
    if (window.confirm(confirmMessage)) {
      await Promise.all(
        scheduleEntries?.items?.map((entry) => {
          console.log(entry.id)
          return API.graphql({ query: deleteActivityScheduleEntry, variables: { input: { id: entry.id } } })
        })
      )
      await API.graphql({ query: deleteActivityMutation, variables: { input: { id } } })
    }
    fetchActivities();
  }

  return (
    <View>
      <div className="text-xl font-bold flex justify-center py-4">Manage Facilities and Activities</div>
      <div className="w-full flex sm:justify-center">
        <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
          <Tab value={0} key={0} label="Facilities"></Tab>
          <Tab value={1} key={1} label="Activities"></Tab>
        </Tabs>
      </div>
      {tab == 0 && (
        <div className="flex flex-col justify-center">
          <View as="form" margin="3rem 0" onSubmit={createFacility}>
            <Flex direction="row" justifyContent="center">
              <TextField
                name="name"
                placeholder="Facility Name"
                label="Facility Name"
                labelHidden
                variation="quiet"
                required
              />
              <Button type="submit" variant="contained">
                Create Facility
              </Button>
            </Flex>
          </View>
          <div className="text-center">Current Facilities</div>
          <div className="grid">
            {facilities.map((facility) => (
              <Flex
                key={facility.id || facility.name}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Text as="strong" fontWeight={700}>
                  {facility.name}
                </Text>
                <Tooltip placement="right" title={activities.find((activity) => activity.facility?.id == facility.id) ? "Delete all the activities at this facility before it can be deleted." : ""}>
                  <span>
                    <Button onClick={() => deleteFacility(facility)} disabled={activities.find((activity) => activity.facility?.id == facility.id)}>
                      <DeleteIcon />
                    </Button>
                  </span>
                </Tooltip>
              </Flex>
            ))}
          </div>
        </div>
      )}
      {tab == 1 && (
        <div className="flex flex-col items-center">
          <div className="text-center">Current Activities</div>
          <div className="w-full sm:w-2/3">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell as="th">
                    Activity
                  </TableCell>
                  <TableCell as="th">
                    Usage (out of 100%)
                  </TableCell>
                  <TableCell as="th">
                    Location
                  </TableCell>
                  <TableCell as="th">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              {activities.map((activity) => (
                <TableRow>
                  <TableCell>
                    {activity.name}
                  </TableCell>
                  <TableCell>
                    {activity.usage}
                  </TableCell>
                  <TableCell>
                    {activity.facility?.name}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => deleteActivity(activity)}><DeleteIcon /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
          <View as="form" margin="3rem 0" onSubmit={createActivity}>
            <Flex direction="column" justifyContent="center">
              <TextField
                name="name"
                placeholder="Activity Name"
                label="Activity Name"
                labelHidden
                variation="quiet"
                required
              />
              <SelectField
                label="Facilities"
                name="facility"
              >
                {facilities.map((facility) => {
                  return <option value={facility.id}>{facility.name}</option>
                })}
              </SelectField>
              <SliderField
                label="Usage"
                max={100}
                min={0}
                name="usage"
                step={5}
              />
              <Button type="submit" variant="contained">
                Create Activity
              </Button>
            </Flex>
          </View>
        </div>
      )}
    </View>
  );
};

export default ActivityFacility;