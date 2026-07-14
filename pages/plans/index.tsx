import {
  Box,
  Button,
  Flex,
  H1,
  H3,
  H4,
  Panel,
  Small,
  Text,
} from '@bigcommerce/big-design'
import { CheckIcon } from '@bigcommerce/big-design-icons'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import ErrorMessage from '../../components/error'
import Loading from '../../components/loading'
import { useAlerts } from '../../context/alerts'
import { useSession } from '../../context/session'
import { useSubscription } from '../../lib/hooks'
import { Plan, PLANS } from '../../lib/plans'
import { Subscription } from '../../types'

const Plans = () => {
  const { context } = useSession()
  const { subscription, isLoading, error, mutate } = useSubscription()
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const alerts = useAlerts()

  useEffect(() => {
    if (actionError) {
      alerts.add({
        messages: [{ text: 'Something went wrong. See details below.' }],
        type: 'error',
        autoDismiss: true,
      })
    }
  }, [actionError, alerts])

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage error={error} />

  const currentLevel =
    subscription?.status === 'ACTIVE' ? subscription.product.productLevel : null

  const handleSelectPlan = async (plan: Plan) => {
    setActionError(null)
    setLoadingPlanId(plan.id)
    try {
      const res = await fetch(`/api/billing/checkout?context=${context}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          // Pass subscriptionId so UB treats this as a plan change, not a new subscription
          ...(subscription?.status === 'ACTIVE' && {
            subscriptionId: subscription.id,
          }),
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(body, null, 2))
      const popup = window.open(body.checkoutUrl, '_blank')
      if (popup) {
        const timer = setInterval(() => {
          if (popup.closed) {
            clearInterval(timer)
            setLoadingPlanId(null)
            mutate()
          }
        }, 500)
      } else {
        setLoadingPlanId(null)
      }
    } catch (err) {
      setActionError(err.message)
      setLoadingPlanId(null)
    }
  }

  const handleCancel = async () => {
    if (!subscription || isCancelling) return
    setActionError(null)
    setIsCancelling(true)
    try {
      const res = await fetch(`/api/billing/subscription?context=${context}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(body, null, 2))
      mutate()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setIsCancelling(false)
    }
  }

  const getButtonLabel = (plan: Plan) => {
    if (plan.productLevel === currentLevel) return 'Current plan'
    if (subscription?.status === 'ACTIVE') return 'Switch to plan'

    return 'Select plan'
  }

  const currentPlanName = currentLevel
    ? (PLANS.find((p) => p.productLevel === currentLevel)?.name ?? currentLevel)
    : null

  return (
    <Panel header="Subscription Plans" id="plans">
      <PanelInner>
        <CurrentPlanBadge>
          {currentPlanName ? (
            <>
              Current plan: <strong>{currentPlanName}</strong>
            </>
          ) : (
            'You are not yet subscribed.'
          )}
        </CurrentPlanBadge>

        {subscription && (
          <SubscriptionStatus
            subscription={subscription}
            onCancel={handleCancel}
            isCancelling={isCancelling}
          />
        )}

        <Text marginBottom="xLarge">
          Choose the plan that works for your store.
        </Text>

        <Flex alignItems="stretch">
          {PLANS.map((plan, i) => (
            <PlanCard
              key={plan.id}
              $recommended={plan.recommended}
              border="box"
              borderRadius="normal"
              padding="xLarge"
              marginRight={i < PLANS.length - 1 ? 'xLarge' : 'none'}
            >
              {plan.recommended && (
                <RecommendedBadge>Most popular</RecommendedBadge>
              )}
              <H3 marginBottom="none">{plan.name}</H3>
              <Box marginBottom="medium" style={{ minHeight: '2.5em' }}>
                <Small color="secondary60">{plan.description}</Small>
              </Box>

              <Flex alignItems="baseline" marginBottom="medium">
                {plan.price === 0 ? (
                  <H1 marginBottom="none">Free</H1>
                ) : (
                  <>
                    <H1 marginBottom="none">${plan.price}</H1>
                    <Text color="secondary60" marginLeft="xSmall">
                      /month
                    </Text>
                  </>
                )}
              </Flex>

              <FeatureDivider />

              <FeatureList>
                {plan.features.map((feature) => (
                  <Flex key={feature} alignItems="center" marginBottom="xSmall">
                    <CheckIcon
                      color="success"
                      size="small"
                      style={{ flexShrink: 0 }}
                    />
                    <Small marginLeft="xSmall" marginBottom="none">
                      {feature}
                    </Small>
                  </Flex>
                ))}
              </FeatureList>

              <Button
                variant={
                  plan.productLevel === currentLevel ? 'secondary' : 'primary'
                }
                disabled={
                  plan.productLevel === currentLevel || loadingPlanId !== null
                }
                isLoading={loadingPlanId === plan.id}
                onClick={() => handleSelectPlan(plan)}
              >
                {getButtonLabel(plan)}
              </Button>
            </PlanCard>
          ))}
        </Flex>

        {actionError && (
          <ErrorPanel
            error={actionError}
            onDismiss={() => setActionError(null)}
          />
        )}
      </PanelInner>
    </Panel>
  )
}

const SubscriptionStatus = ({
  subscription,
  onCancel,
  isCancelling,
}: {
  subscription: Subscription
  onCancel: () => void
  isCancelling: boolean
}) => {
  const isCancelledWithAccess =
    subscription.status === 'CANCELLED' &&
    new Date(subscription.currentPeriodEnd) > new Date()

  const statusLabel = () => {
    if (subscription.status === 'ACTIVE') return 'Active'
    if (subscription.status === 'SUSPENDED')
      return 'Suspended — check payment method'
    if (isCancelledWithAccess) return 'Cancelled — access until period end'

    return 'Cancelled'
  }

  return (
    <Box
      marginBottom="xxLarge"
      padding="large"
      border="box"
      borderRadius="normal"
    >
      <H4 marginBottom="medium">Current subscription</H4>
      <Flex>
        <StatusField label="Plan" value={subscription.product.productLevel} />
        <StatusField label="Status" value={statusLabel()} />
        <StatusField
          label="Price"
          value={`$${subscription.pricePerInterval.value}/${subscription.billingInterval.toLowerCase()}`}
        />
        <StatusField
          label={
            subscription.status === 'CANCELLED' ? 'Access until' : 'Renews'
          }
          value={new Date(subscription.currentPeriodEnd).toLocaleDateString()}
        />
      </Flex>
      {subscription.status === 'ACTIVE' && (
        <Button
          variant="subtle"
          onClick={onCancel}
          isLoading={isCancelling}
          disabled={isCancelling}
          marginTop="medium"
        >
          Cancel subscription
        </Button>
      )}
    </Box>
  )
}

const CurrentPlanBadge = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.secondary60};
`

const StatusField = ({ label, value }: { label: string; value: string }) => (
  <Box marginRight="xxLarge">
    <Small bold>{label}</Small>
    <Text>{value}</Text>
  </Box>
)

const PanelInner = styled.div``

const PlanCard = styled(Box)<{ $recommended?: boolean }>`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  ${({ $recommended, theme }) =>
    $recommended && `border-color: ${theme.colors.primary};`}
`

const RecommendedBadge = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  white-space: nowrap;
`

const FeatureList = styled(Box)`
  flex: 1;
  margin-bottom: ${({ theme }) => theme.spacing.xLarge};
`

const FeatureDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary20};
  margin: ${({ theme }) => `${theme.spacing.medium} 0`};
`

function formatError(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

const ErrorPanel = ({
  error,
  onDismiss,
}: {
  error: string
  onDismiss: () => void
}) => {
  const [copied, setCopied] = useState(false)
  const formatted = formatError(error)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(formatted)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [formatted])

  return (
    <ErrorBox marginTop="xLarge" padding="large">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        marginBottom="small"
      >
        <H4 marginBottom="none" color="danger50">
          Error
        </H4>
        <Flex>
          <ErrorButton onClick={handleCopy} style={{ marginRight: 4 }}>
            {copied ? 'Copied!' : 'Copy'}
          </ErrorButton>
          <ErrorButton onClick={onDismiss}>Dismiss</ErrorButton>
        </Flex>
      </Flex>
      <ErrorPre>{formatted}</ErrorPre>
    </ErrorBox>
  )
}

const ErrorBox = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.danger40};
  border-radius: ${({ theme }) => theme.borderRadius.normal};
  background: ${({ theme }) => theme.colors.danger10};
`

const ErrorButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.danger50};

  &:hover {
    background: ${({ theme }) => theme.colors.danger20};
  }
`

const ErrorPre = styled.pre`
  margin: 0;
  font-size: 0.75rem;
  white-space: pre-wrap;
  word-break: break-all;
  color: ${({ theme }) => theme.colors.danger50};
`

export default Plans
