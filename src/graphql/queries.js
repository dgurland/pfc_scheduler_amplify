/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getFacility = /* GraphQL */ `
  query GetFacility($id: ID!) {
    getFacility(id: $id) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listFacilities = /* GraphQL */ `
  query ListFacilities(
    $filter: ModelFacilityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFacilities(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getActivity = /* GraphQL */ `
  query GetActivity($id: ID!) {
    getActivity(id: $id) {
      id
      name
      usage
      facilityId
      facility {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      scheduleEntries {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listActivities = /* GraphQL */ `
  query ListActivities(
    $filter: ModelActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        usage
        facilityId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSchedule = /* GraphQL */ `
  query GetSchedule($id: ID!) {
    getSchedule(id: $id) {
      id
      date
      periods
      entries {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listSchedules = /* GraphQL */ `
  query ListSchedules(
    $filter: ModelScheduleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSchedules(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        periods
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getScheduleEntry = /* GraphQL */ `
  query GetScheduleEntry($id: ID!) {
    getScheduleEntry(id: $id) {
      id
      period
      division
      schedule {
        id
        date
        periods
        createdAt
        updatedAt
        __typename
      }
      activities {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      scheduleEntriesId
      __typename
    }
  }
`;
export const listScheduleEntries = /* GraphQL */ `
  query ListScheduleEntries(
    $filter: ModelScheduleEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listScheduleEntries(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        period
        division
        createdAt
        updatedAt
        scheduleEntriesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getActivityScheduleEntry = /* GraphQL */ `
  query GetActivityScheduleEntry($id: ID!) {
    getActivityScheduleEntry(id: $id) {
      id
      activity {
        id
        name
        usage
        facilityId
        createdAt
        updatedAt
        __typename
      }
      scheduleEntry {
        id
        period
        division
        createdAt
        updatedAt
        scheduleEntriesId
        __typename
      }
      label
      createdAt
      updatedAt
      activityScheduleEntriesId
      scheduleEntryActivitiesId
      __typename
    }
  }
`;
export const listActivityScheduleEntries = /* GraphQL */ `
  query ListActivityScheduleEntries(
    $filter: ModelActivityScheduleEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listActivityScheduleEntries(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        label
        createdAt
        updatedAt
        activityScheduleEntriesId
        scheduleEntryActivitiesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
