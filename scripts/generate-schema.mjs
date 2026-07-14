#!/usr/bin/env node
import { writeFileSync } from 'fs'
import { createRequire } from 'module'
import { getIntrospectionQuery, buildClientSchema, printSchema } from 'graphql'

const require = createRequire(import.meta.url)
require('dotenv').config({ path: '.env' })

const accountUuid = process.env.BC_ACCOUNT_UUID
const apiToken = process.env.BC_ACCOUNT_API_TOKEN

if (!accountUuid || !apiToken) {
  console.error('Missing BC_ACCOUNT_UUID or BC_ACCOUNT_API_TOKEN in .env')
  process.exit(1)
}

const url = `https://api.bigcommerce.com/accounts/${accountUuid}/graphql`

console.log(`Fetching schema from ${url}...`)

const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': apiToken,
  },
  body: JSON.stringify({ query: getIntrospectionQuery() }),
})

if (!res.ok) {
  const text = await res.text()
  console.error(`Failed: ${res.status} ${res.statusText}\n${text}`)
  process.exit(1)
}

const { data } = await res.json()
const schema = printSchema(buildClientSchema(data))
writeFileSync('schema.graphql', schema)
console.log('Wrote schema.graphql')
