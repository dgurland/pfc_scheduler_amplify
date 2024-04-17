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
export const onCreateSchedule = /* GraphQL */ `
  subscription OnCreateSchedule($filter: ModelSubscriptionScheduleFilterInput) {
    onCreateSchedule(filter: $filter) {
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
export const onUpdateSchedule = /* GraphQL */ `
  subscription OnUpdateSchedule($filter: ModelSubscriptionScheduleFilterInput) {
    onUpdateSchedule(filter: $filter) {
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
export const onDeleteSchedule = /* GraphQL */ `
  subscription OnDeleteSchedule($filter: ModelSubscriptionScheduleFilterInput) {
    onDeleteSchedule(filter: $filter) {
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
export const onCreateScheduleEntry = /* GraphQL */ `
  subscription OnCreateScheduleEntry(
    $filter: ModelSubscriptionScheduleEntryFilterInput
  ) {
    onCreateScheduleEntry(filter: $filter) {
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
export const onUpdateScheduleEntry = /* GraphQL */ `
  subscription OnUpdateScheduleEntry(
    $filter: ModelSubscriptionScheduleEntryFilterInput
  ) {
    onUpdateScheduleEntry(filter: $filter) {
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
export const onDeleteScheduleEntry = /* GraphQL */ `
  subscription OnDeleteScheduleEntry(
    $filter: ModelSubscriptionScheduleEntryFilterInput
  ) {
    onDeleteScheduleEntry(filter: $filter) {
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
export const onCreateActivityScheduleEntry = /* GraphQL */ `
  subscription OnCreateActivityScheduleEntry(
    $filter: ModelSubscriptionActivityScheduleEntryFilterInput
  ) {
    onCreateActivityScheduleEntry(filter: $filter) {
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
export const onUpdateActivityScheduleEntry = /* GraphQL */ `
  subscription OnUpdateActivityScheduleEntry(
    $filter: ModelSubscriptionActivityScheduleEntryFilterInput
  ) {
    onUpdateActivityScheduleEntry(filter: $filter) {
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
export const onDeleteActivityScheduleEntry = /* GraphQL */ `
  subscription OnDeleteActivityScheduleEntry(
    $filter: ModelSubscriptionActivityScheduleEntryFilterInput
  ) {
    onDeleteActivityScheduleEntry(filter: $filter) {
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
export const onCreateCalendarEvent = /* GraphQL */ `
  subscription OnCreateCalendarEvent(
    $filter: ModelSubscriptionCalendarEventFilterInput
  ) {
    onCreateCalendarEvent(filter: $filter) {
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
export const onUpdateCalendarEvent = /* GraphQL */ `
  subscription OnUpdateCalendarEvent(
    $filter: ModelSubscriptionCalendarEventFilterInput
  ) {
    onUpdateCalendarEvent(filter: $filter) {
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
export const onDeleteCalendarEvent = /* GraphQL */ `
  subscription OnDeleteCalendarEvent(
    $filter: ModelSubscriptionCalendarEventFilterInput
  ) {
    onDeleteCalendarEvent(filter: $filter) {
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
