import { Box, H3, Panel, Text } from '@bigcommerce/big-design'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const GqlCheck = () => {
  const { data, error } = useSWR('/api/gql-check', fetcher)

  return (
    <Panel header="GQL Connectivity Check">
      <Box>
        {!data && !error && <Text>Checking...</Text>}
        {error && <Text color="danger50">Error: {error.message}</Text>}
        {data && (
          <>
            <H3 color="success40">Connected</H3>
            <pre style={{ fontFamily: 'monospace', fontSize: 13 }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </>
        )}
      </Box>
    </Panel>
  )
}

export default GqlCheck
