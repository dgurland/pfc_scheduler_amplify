/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createFacility = /* GraphQL */ `
  mutation CreateFacility(
    $input: CreateFacilityInput!
    $condition: ModelFacilityConditionInput
  ) {
    createFacility(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateFacility = /* GraphQL */ `
  mutation UpdateFacility(
    $input: UpdateFacilityInput!
    $condition: ModelFacilityConditionInput
  ) {
    updateFacility(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteFacility = /* GraphQL */ `
  mutation DeleteFacility(
    $input: DeleteFacilityInput!
    $condition: ModelFacilityConditionInput
  ) {
    deleteFacility(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createActivity = /* GraphQL */ `
  mutation CreateActivity(
    $input: CreateActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    createActivity(input: $input, condition: $condition) {
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
export const updateActivity = /* GraphQL */ `
  mutation UpdateActivity(
    $input: UpdateActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    updateActivity(input: $input, condition: $condition) {
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
export const deleteActivity = /* GraphQL */ `
  mutation DeleteActivity(
    $input: DeleteActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    deleteActivity(input: $input, condition: $condition) {
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
export const createScheduleEntry = /* GraphQL */ `
  mutation CreateScheduleEntry(
    $input: CreateScheduleEntryInput!
    $condition: ModelScheduleEntryConditionInput
  ) {
    createScheduleEntry(input: $input, condition: $condition) {
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
export const updateScheduleEntry = /* GraphQL */ `
  mutation UpdateScheduleEntry(
    $input: UpdateScheduleEntryInput!
    $condition: ModelScheduleEntryConditionInput
  ) {
    updateScheduleEntry(input: $input, condition: $condition) {
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
export const deleteScheduleEntry = /* GraphQL */ `
  mutation DeleteScheduleEntry(
    $input: DeleteScheduleEntryInput!
    $condition: ModelScheduleEntryConditionInput
  ) {
    deleteScheduleEntry(input: $input, condition: $condition) {
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
