import { NextApiRequest, NextApiResponse } from 'next'
import { accountClient } from '../../lib/account-client'
import { graphql } from '../../lib/graphql'

const AccountQuery = graphql(`
  query GqlCheck {
    account {
      id
      accountInfo {
        name
      }
    }
  }
`)

export default async function gqlCheck(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await accountClient.request(AccountQuery)
    res.status(200).json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    res.status(500).json({ message })
  }
}
