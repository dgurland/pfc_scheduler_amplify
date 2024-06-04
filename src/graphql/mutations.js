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
      scheduleEntries {
        nextToken
        __typename
      }
      employees {
        nextToken
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
      scheduleEntries {
        nextToken
        __typename
      }
      employees {
        nextToken
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
      scheduleEntries {
        nextToken
        __typename
      }
      employees {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createSchedule = /* GraphQL */ `
  mutation CreateSchedule(
    $input: CreateScheduleInput!
    $condition: ModelScheduleConditionInput
  ) {
    createSchedule(input: $input, condition: $condition) {
      id
      date
      periods
      entries {
        nextToken
        __typename
      }
      periodNames
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateSchedule = /* GraphQL */ `
  mutation UpdateSchedule(
    $input: UpdateScheduleInput!
    $condition: ModelScheduleConditionInput
  ) {
    updateSchedule(input: $input, condition: $condition) {
      id
      date
      periods
      entries {
        nextToken
        __typename
      }
      periodNames
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteSchedule = /* GraphQL */ `
  mutation DeleteSchedule(
    $input: DeleteScheduleInput!
    $condition: ModelScheduleConditionInput
  ) {
    deleteSchedule(input: $input, condition: $condition) {
      id
      date
      periods
      entries {
        nextToken
        __typename
      }
      periodNames
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
      period
      division
      schedule {
        id
        date
        periods
        periodNames
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
export const updateScheduleEntry = /* GraphQL */ `
  mutation UpdateScheduleEntry(
    $input: UpdateScheduleEntryInput!
    $condition: ModelScheduleEntryConditionInput
  ) {
    updateScheduleEntry(input: $input, condition: $condition) {
      id
      period
      division
      schedule {
        id
        date
        periods
        periodNames
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
export const deleteScheduleEntry = /* GraphQL */ `
  mutation DeleteScheduleEntry(
    $input: DeleteScheduleEntryInput!
    $condition: ModelScheduleEntryConditionInput
  ) {
    deleteScheduleEntry(input: $input, condition: $condition) {
      id
      period
      division
      schedule {
        id
        date
        periods
        periodNames
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
export const createActivityScheduleEntry = /* GraphQL */ `
  mutation CreateActivityScheduleEntry(
    $input: CreateActivityScheduleEntryInput!
    $condition: ModelActivityScheduleEntryConditionInput
  ) {
    createActivityScheduleEntry(input: $input, condition: $condition) {
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
export const updateActivityScheduleEntry = /* GraphQL */ `
  mutation UpdateActivityScheduleEntry(
    $input: UpdateActivityScheduleEntryInput!
    $condition: ModelActivityScheduleEntryConditionInput
  ) {
    updateActivityScheduleEntry(input: $input, condition: $condition) {
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
export const deleteActivityScheduleEntry = /* GraphQL */ `
  mutation DeleteActivityScheduleEntry(
    $input: DeleteActivityScheduleEntryInput!
    $condition: ModelActivityScheduleEntryConditionInput
  ) {
    deleteActivityScheduleEntry(input: $input, condition: $condition) {
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
export const createCalendarEvent = /* GraphQL */ `
  mutation CreateCalendarEvent(
    $input: CreateCalendarEventInput!
    $condition: ModelCalendarEventConditionInput
  ) {
    createCalendarEvent(input: $input, condition: $condition) {
      id
      date
      title
      category
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCalendarEvent = /* GraphQL */ `
  mutation UpdateCalendarEvent(
    $input: UpdateCalendarEventInput!
    $condition: ModelCalendarEventConditionInput
  ) {
    updateCalendarEvent(input: $input, condition: $condition) {
      id
      date
      title
      category
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCalendarEvent = /* GraphQL */ `
  mutation DeleteCalendarEvent(
    $input: DeleteCalendarEventInput!
    $condition: ModelCalendarEventConditionInput
  ) {
    deleteCalendarEvent(input: $input, condition: $condition) {
      id
      date
      title
      category
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createEmployee = /* GraphQL */ `
  mutation CreateEmployee(
    $input: CreateEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    createEmployee(input: $input, condition: $condition) {
      id
      name
      division
      activities {
        nextToken
        __typename
      }
      daysOff
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateEmployee = /* GraphQL */ `
  mutation UpdateEmployee(
    $input: UpdateEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    updateEmployee(input: $input, condition: $condition) {
      id
      name
      division
      activities {
        nextToken
        __typename
      }
      daysOff
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteEmployee = /* GraphQL */ `
  mutation DeleteEmployee(
    $input: DeleteEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    deleteEmployee(input: $input, condition: $condition) {
      id
      name
      division
      activities {
        nextToken
        __typename
      }
      daysOff
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createActivityEmployee = /* GraphQL */ `
  mutation CreateActivityEmployee(
    $input: CreateActivityEmployeeInput!
    $condition: ModelActivityEmployeeConditionInput
  ) {
    createActivityEmployee(input: $input, condition: $condition) {
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
      employee {
        id
        name
        division
        daysOff
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      activityEmployeesId
      employeeActivitiesId
      __typename
    }
  }
`;
export const updateActivityEmployee = /* GraphQL */ `
  mutation UpdateActivityEmployee(
    $input: UpdateActivityEmployeeInput!
    $condition: ModelActivityEmployeeConditionInput
  ) {
    updateActivityEmployee(input: $input, condition: $condition) {
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
      employee {
        id
        name
        division
        daysOff
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      activityEmployeesId
      employeeActivitiesId
      __typename
    }
  }
`;
export const deleteActivityEmployee = /* GraphQL */ `
  mutation DeleteActivityEmployee(
    $input: DeleteActivityEmployeeInput!
    $condition: ModelActivityEmployeeConditionInput
  ) {
    deleteActivityEmployee(input: $input, condition: $condition) {
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
      employee {
        id
        name
        division
        daysOff
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      activityEmployeesId
      employeeActivitiesId
      __typename
    }
  }
`;
