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
export const getScheduleEntry = /* GraphQL */ `
  query GetScheduleEntry($id: ID!) {
    getScheduleEntry(id: $id) {
      id
      date
      activityIds
      activities {
        nextToken
        __typename
      }
      division
      period
      createdAt
      updatedAt
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
        date
        activityIds
        division
        period
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
