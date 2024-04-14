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