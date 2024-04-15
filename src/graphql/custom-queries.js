export const listActivitiesWithFacilityData = /* GraphQL */ `
  query listActivitiesWithFacilityData(
    $filter: ModelActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        usage
        facility {
            name
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const listScheduleEntriesWithActivityNames = /* GraphQL */ `
query ListScheduleEntries($filter: ModelScheduleEntryFilterInput, $limit: Int, $nextToken: String) {
  listScheduleEntries(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      period,
      division,
      schedule {
        date
      },
      activities {
        items {
          activity {
            name
          }
          label
        }
      }
    }
    nextToken
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
        entries {
          items {
            id
            period
            division
            activities {
              items {
                activity {
                  id
                  name
                }
                label
              }
            }
          }
        }
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
        items {
          id
          period
          division
          activities {
            items {
              id
              label
              activity {
                name
                id
                facilityId
                usage
              }
            }
          }
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;