import { NextApiRequest, NextApiResponse } from 'next'
import { accountClient } from '../../../lib/account-client'
import { getSession } from '../../../lib/auth'
import db from '../../../lib/db'
import { graphql } from '../../../lib/graphql'

const GetCheckoutStatusQuery = graphql(`
  query GetCheckoutStatus($id: ID!) {
    account {
      checkout(id: $id) {
        status
      }
    }
  }
`)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Method not allowed' })

  try {
    const { storeHash } = await getSession(req)
    const checkouts = await db.getCheckoutsByStore(storeHash)

    const pending = checkouts.filter((c) => c.status !== 'COMPLETE')

    await Promise.all(
      pending.map(async (checkout) => {
        try {
          const data = await accountClient.request(GetCheckoutStatusQuery, {
            id: checkout.id,
          })
          const liveStatus = data?.account?.checkout?.status
          if (liveStatus && liveStatus !== checkout.status) {
            await db.updateCheckoutStatus(checkout.id, liveStatus)
            checkout.status = liveStatus
          }
        } catch {
          // leave stale status rather than fail the whole request
        }
      })
    )

    return res.status(200).json({ checkouts })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
