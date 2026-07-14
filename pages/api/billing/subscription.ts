import { NextApiRequest, NextApiResponse } from 'next'
import { accountClient } from '../../../lib/account-client'
import { getSession } from '../../../lib/auth'
import { graphql } from '../../../lib/graphql'
import { Subscription } from '../../../types'

const SubscriptionsQuery = graphql(`
  query GetSubscriptions($scopeId: ID!) {
    account {
      subscriptions(filters: { scopeId: $scopeId, scopeType: STORE }) {
        edges {
          node {
            id
            status
            product {
              id
              type
              productLevel
            }
            pricePerInterval {
              value
              currencyCode
            }
            billingInterval
            currentPeriodEnd
            activationDate
          }
        }
      }
    }
  }
`)

const CancelMutation = graphql(`
  mutation CancelSubscription($subscription: CancelSubscriptionInput!) {
    subscription {
      cancelSubscription(input: $subscription) {
        subscriptionId
        cancelledAt
      }
    }
  }
`)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { storeHash } = await getSession(req)

    if (req.method === 'GET') {
      const scopeId = `bc/account/scope/${storeHash}`
      const data = await accountClient.request(SubscriptionsQuery, { scopeId })

      const all: Subscription[] = (
        data?.account?.subscriptions?.edges ?? []
      ).map((e) => e.node as unknown as Subscription)

      const subscription =
        all.find((s) => s.status === 'ACTIVE') ??
        all.find((s) => s.status === 'SUSPENDED') ??
        all.find((s) => s.status === 'CANCELLED') ??
        null

      return res.status(200).json({ subscription })
    }

    if (req.method === 'DELETE') {
      const { subscriptionId } = req.body
      if (!subscriptionId)
        return res.status(400).json({ message: 'subscriptionId is required' })

      const data = await accountClient.request(CancelMutation, {
        subscription: { id: subscriptionId },
      })

      return res.status(200).json(data?.subscription?.cancelSubscription)
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    const gqlErrors = error?.response?.errors
    if (gqlErrors?.length) {
      return res.status(400).json({ errors: gqlErrors })
    }

    return res.status(500).json({ message: error.message })
  }
}
