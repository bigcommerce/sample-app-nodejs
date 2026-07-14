import { NextApiRequest, NextApiResponse } from 'next'
import { accountClient } from '../../../lib/account-client'
import { getSession } from '../../../lib/auth'
import db from '../../../lib/db'
import { graphql } from '../../../lib/graphql'
import { PLANS } from '../../../lib/plans'

const { BC_APP_PRODUCT_ID, ENVIRONMENT } = process.env

const storeHostDomain =
  ENVIRONMENT === 'bigcommerce.zone'
    ? 'my-integration.zone'
    : 'mybigcommerce.com'

const CreateCheckoutMutation = graphql(`
  mutation CreateCheckout($checkout: CreateCheckoutInput!) {
    checkout {
      createCheckout(input: $checkout) {
        checkout {
          id
          status
          checkoutUrl
        }
      }
    }
  }
`)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' })

  try {
    const { accountUuid, storeHash } = await getSession(req)
    const { planId, subscriptionId } = req.body

    if (!accountUuid)
      return res.status(400).json({
        message: 'Merchant account UUID not found. Please reinstall the app.',
      })

    const plan = PLANS.find((p) => p.id === planId)
    if (!plan)
      return res.status(400).json({ message: `Unknown plan: ${planId}` })

    const item: Record<string, unknown> = {
      product: {
        id: `bc/account/product/${BC_APP_PRODUCT_ID}`,
        type: 'APPLICATION',
        productLevel: plan.productLevel,
      },
      scope: { id: `bc/account/scope/${storeHash}`, type: 'STORE' },
      pricingPlan: {
        interval: plan.interval,
        price: { value: plan.price, currencyCode: 'USD' },
      },
      description: `Blobfish Commerce ${plan.name} Plan`,
      redirectUrl: `https://store-${storeHash}.${storeHostDomain}/manage/app/${BC_APP_PRODUCT_ID}`,
    }

    if (subscriptionId) item.subscriptionId = subscriptionId

    const data = await accountClient.request(CreateCheckoutMutation, {
      checkout: {
        accountId: `bc/account/account/${accountUuid}`,
        items: [item],
      },
    })

    const checkout = data?.checkout?.createCheckout?.checkout

    if (checkout?.id && checkout?.checkoutUrl) {
      await db.saveCheckout(
        checkout.id,
        storeHash,
        planId,
        checkout.checkoutUrl
      )
    }

    return res.status(200).json({
      checkoutId: checkout?.id,
      checkoutUrl: checkout?.checkoutUrl,
    })
  } catch (error) {
    const gqlErrors = error?.response?.errors
    if (gqlErrors?.length) {
      return res.status(400).json({ errors: gqlErrors })
    }

    return res.status(500).json({ message: error.message })
  }
}
