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
        createdAt
        updatedAt
        __typename
      }
      activities {
        items {
          activity {
            id
          }
          label
        }
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