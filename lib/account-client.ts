import { GraphQLClient } from 'graphql-request'

const accountUuid = process.env.BC_ACCOUNT_UUID
const apiToken = process.env.BC_ACCOUNT_API_TOKEN
const apiUrl = process.env.API_URL ?? 'api.bigcommerce.com'

export const accountClient = new GraphQLClient(
  `https://${apiUrl}/accounts/${accountUuid}/graphql`,
  {
    headers: {
      'X-Auth-Token': apiToken ?? '',
    },
  }
)
