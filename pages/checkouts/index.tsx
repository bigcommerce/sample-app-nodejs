import { Badge, Box, Link, Panel, Table, Text } from '@bigcommerce/big-design'
import ErrorMessage from '../../components/error'
import Loading from '../../components/loading'
import { useCheckouts } from '../../lib/hooks'
import { CheckoutRecord } from '../../types'

const statusVariant: Record<string, 'success' | 'warning' | 'secondary'> = {
  COMPLETE: 'success',
  PROCESSING: 'warning',
  PENDING: 'secondary',
}

const Checkouts = () => {
  const { checkouts, isLoading, error } = useCheckouts()

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage error={error} />

  return (
    <Panel header="Checkouts" id="checkouts">
      <Table
        columns={[
          {
            header: 'Plan',
            hash: 'plan_id',
            render: ({ plan_id }: CheckoutRecord) => plan_id,
          },
          {
            header: 'Status',
            hash: 'status',
            render: ({ status, checkout_url }: CheckoutRecord) => (
              <Box as="span" display="flex" style={{ gap: '1rem' }}>
                <Badge
                  variant={statusVariant[status] ?? 'warning'}
                  label={status}
                />
                {(status === 'PENDING' || status === 'PROCESSING') && (
                  <Link href={checkout_url} target="_blank" external>
                    {status === 'PENDING' ? 'Resume' : 'View'}
                  </Link>
                )}
              </Box>
            ),
          },
          {
            header: 'Date',
            hash: 'created_at',
            render: ({ created_at }: CheckoutRecord) =>
              new Date(created_at * 1000).toLocaleString(),
          },
          {
            header: 'ID',
            hash: 'id',
            render: ({ id }: CheckoutRecord) => (
              <Text marginBottom="none" color="secondary60">
                {id.split('/').pop()}
              </Text>
            ),
          },
        ]}
        items={checkouts}
        emptyComponent={<Text>No checkouts yet.</Text>}
        keyField="id"
        stickyHeader
      />
    </Panel>
  )
}

export default Checkouts
