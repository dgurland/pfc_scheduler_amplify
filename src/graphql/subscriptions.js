/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateFacility = /* GraphQL */ `
  subscription OnCreateFacility($filter: ModelSubscriptionFacilityFilterInput) {
    onCreateFacility(filter: $filter) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateFacility = /* GraphQL */ `
  subscription OnUpdateFacility($filter: ModelSubscriptionFacilityFilterInput) {
    onUpdateFacility(filter: $filter) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteFacility = /* GraphQL */ `
  subscription OnDeleteFacility($filter: ModelSubscriptionFacilityFilterInput) {
    onDeleteFacility(filter: $filter) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateActivity = /* GraphQL */ `
  subscription OnCreateActivity($filter: ModelSubscriptionActivityFilterInput) {
    onCreateActivity(filter: $filter) {
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
export const onUpdateActivity = /* GraphQL */ `
  subscription OnUpdateActivity($filter: ModelSubscriptionActivityFilterInput) {
    onUpdateActivity(filter: $filter) {
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
export const onDeleteActivity = /* GraphQL */ `
  subscription OnDeleteActivity($filter: ModelSubscriptionActivityFilterInput) {
    onDeleteActivity(filter: $filter) {
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
export const onCreateScheduleEntry = /* GraphQL */ `
  subscription OnCreateScheduleEntry(
    $filter: ModelSubscriptionScheduleEntryFilterInput
  ) {
    onCreateScheduleEntry(filter: $filter) {
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
export const onUpdateScheduleEntry = /* GraphQL */ `
  subscription OnUpdateScheduleEntry(
    $filter: ModelSubscriptionScheduleEntryFilterInput
  ) {
    onUpdateScheduleEntry(filter: $filter) {
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
export const onDeleteScheduleEntry = /* GraphQL */ `
  subscription OnDeleteScheduleEntry(
    $filter: ModelSubscriptionScheduleEntryFilterInput
  ) {
    onDeleteScheduleEntry(filter: $filter) {
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
