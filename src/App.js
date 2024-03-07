import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from 'aws-amplify/api';
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  withAuthenticator,
  SelectField,
  SliderField
} from "@aws-amplify/ui-react";
import { listActivities, listFacilities } from "./graphql/queries";
import { listActivitiesWithFacilityData } from "./graphql/custom-queries";
import {
  createFacility as createFacilityMutation,
  deleteFacility as deleteFacilityMutation,
  createActivity as createActivityMutation,
  deleteActivity as deleteActivityMutation,
} from "./graphql/mutations";

const App = ({ signOut }) => {
  const [facilities, setFacilities] = useState([]);
  const [activities, setActivities] = useState([]);

  const API = generateClient();

  useEffect(() => {
    fetchFacilities();
    fetchActivities();
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
    console.log(data)
    await API.graphql({
      query: createActivityMutation,
      variables: { input: data },
    });
    fetchActivities();
    event.target.reset();
  }

  async function deleteFacility({ id }) {
    const newFacilities = facilities.filter((facility) => facility.id !== id);
    setFacilities(newFacilities);
    await API.graphql({
      query: deleteFacilityMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <Heading level={1}>My Facilities App</Heading>
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
          <Button type="submit" variation="primary">
            Create Facility
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Facilities</Heading>
      <View margin="3rem 0">
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
            <Button variation="link" onClick={() => deleteFacility(facility)}>
              Delete facility
            </Button>
          </Flex>
        ))}
      </View>
      <View as="form" margin="3rem 0" onSubmit={createActivity}>
        <Flex direction="row" justifyContent="center">
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
          <Button type="submit" variation="primary">
            Create Activity
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Activities</Heading>
      <View margin="3rem 0">
        {activities.map((activity) => (
          <Flex
            key={activity.id || activity.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {activity.name}
            </Text>
            <Text fontWeight={500}>
              Usage: {activity.usage} / 100
            </Text>
            <Text fontWeight={500}>
              Location: {activity.facility?.name}
            </Text>
            {/* <Button variation="link" onClick={() => deleteFacility(facility)}>
              Delete facility
            </Button> */}
          </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);