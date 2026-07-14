import { Box, H4, Link, Panel, Text } from '@bigcommerce/big-design'
import styled from 'styled-components'

interface DocLink {
  label: string
  url: string
  description: string
}

interface DocSection {
  title: string
  links: DocLink[]
}

const SECTIONS: DocSection[] = [
  {
    title: 'Unified Billing',
    links: [
      {
        label: 'Unified Billing Overview',
        url: 'https://developer.bigcommerce.com/docs/integrations/apps/unified-billing',
        description: 'How to integrate subscription billing into your app.',
      },
      {
        label: 'GraphQL Account API: Unified Billing',
        url: 'https://docs.bigcommerce.com/developer/docs/integrations/apps/unified-billing/example-queries-and-mutations',
        description:
          'Example queries and mutations for subscriptions, checkouts, and charges.',
      },
      {
        label: 'GraphQL Account API Reference',
        url: 'https://developer.bigcommerce.com/docs/graphql-account',
        description: 'Full schema reference for the Account-level GraphQL API.',
      },
    ],
  },
  {
    title: 'App Development',
    links: [
      {
        label: 'Building Apps Guide',
        url: 'https://developer.bigcommerce.com/docs/integrations/apps/guide',
        description: 'End-to-end guide for building a BigCommerce app.',
      },
      {
        label: 'Single-Click App OAuth Flow',
        url: 'https://developer.bigcommerce.com/docs/integrations/apps/guide/auth',
        description: 'How the install/auth/load/uninstall callback flow works.',
      },
      {
        label: 'Managing Apps in the Developer Portal',
        url: 'https://developer.bigcommerce.com/docs/integrations/apps/guide/developer-portal',
        description:
          'Creating apps, setting scopes, and managing credentials in devtools.',
      },
    ],
  },
  {
    title: 'Authentication & Scopes',
    links: [
      {
        label: 'API Accounts & OAuth Scopes',
        url: 'https://developer.bigcommerce.com/docs/start/authentication/api-accounts',
        description:
          'All available OAuth scopes for store-level and account-level API tokens.',
      },
      {
        label: 'Authentication Overview',
        url: 'https://developer.bigcommerce.com/docs/start/authentication',
        description:
          'How BigCommerce authentication works across different API types.',
      },
    ],
  },
  {
    title: 'References',
    links: [
      {
        label: 'node-bigcommerce',
        url: 'https://github.com/bigcommerce/node-bigcommerce',
        description:
          'The Node.js client used by this app for store-level API calls.',
      },
      {
        label: 'BigCommerce Developer Portal',
        url: 'https://devtools.bigcommerce.com',
        description: 'Manage your draft and published apps.',
      },
      {
        label: 'BigCommerce Staging Developer Portal',
        url: 'https://build.integration.zone/',
        description:
          'Manage apps on the staging (bigcommerce.zone) environment.',
      },
    ],
  },
]

const Docs = () => (
  <Panel header="Docs" id="docs">
    <Grid>
      {SECTIONS.map((section) => (
        <Box key={section.title}>
          <H4>{section.title}</H4>
          <LinkList>
            {section.links.map((link) => (
              <li key={link.url}>
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </Link>
                <Text marginBottom="none" color="secondary60">
                  {link.description}
                </Text>
              </li>
            ))}
          </LinkList>
        </Box>
      ))}
    </Grid>
  </Panel>
)

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: ${({ theme }) => theme.spacing.xLarge};
`

const LinkList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`

export default Docs
