#!/usr/bin/env node
import ora from 'ora'
import inquirer from 'inquirer'
import { randomBytes } from 'crypto'
import { existsSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { createRequire } from 'module'
import chalk from 'chalk'

const require = createRequire(import.meta.url)

const openUrl = (url) => {
  const opener =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
        ? 'start'
        : 'xdg-open'
  try {
    execSync(`${opener} "${url}"`)
  } catch {}
}

const ask = (questions) => inquirer.prompt(questions)

const pause = (message) =>
  ask([{ type: 'input', name: '_', message, prefix: chalk.dim('→') }])

const REQUIRED_VARS = [
  'CLIENT_ID',
  'CLIENT_SECRET',
  'AUTH_CALLBACK',
  'APP_URL',
  'JWT_KEY',
  'BC_ACCOUNT_UUID',
  'BC_ACCOUNT_API_TOKEN',
  'BC_APP_PRODUCT_ID',
  'ENVIRONMENT',
]

const runCheck = async () => {
  console.log(chalk.bold('\nBlobfish Commerce — check\n'))

  if (!existsSync('.env')) {
    console.log(chalk.red('✗  .env not found. Run setup first.'))
    process.exit(1)
  }

  require('dotenv').config({ path: '.env' })

  const spinner = ora('Checking environment variables…').start()
  const missing = REQUIRED_VARS.filter((k) => !process.env[k]?.trim())
  if (missing.length) {
    spinner.fail('Environment variables')
    for (const k of missing) console.log(`   ${chalk.red('✗')}  ${k}`)
  } else {
    spinner.succeed('Environment variables')
    for (const k of REQUIRED_VARS) console.log(`   ${chalk.green('✓')}  ${k}`)
  }

  const apiHost = `api.${process.env.ENVIRONMENT ?? 'bigcommerce.com'}`
  const spinner2 = ora(`Pinging BC Account API (${apiHost})…`).start()
  try {
    const res = await fetch(
      `https://${apiHost}/accounts/${process.env.BC_ACCOUNT_UUID}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': process.env.BC_ACCOUNT_API_TOKEN,
        },
        body: JSON.stringify({ query: '{ account { id } }' }),
      }
    )
    const json = await res.json()
    if (json.errors?.length) throw new Error(json.errors[0].message)
    spinner2.succeed('BC Account API')
  } catch (err) {
    spinner2.fail(`BC Account API  ${chalk.dim(err.message)}`)
  }

  console.log()
  if (missing.length) {
    console.log(chalk.red('Issues found — re-run setup to fix.\n'))
    process.exit(1)
  } else {
    console.log(chalk.green('All good.\n'))
  }
}

if (process.argv.includes('--check')) {
  await runCheck()
  process.exit(0)
}

console.log(chalk.bold('\nBlobfish Commerce — setup\n'))

if (existsSync('.env')) {
  const { mode } = await ask([
    {
      type: 'list',
      name: 'mode',
      message: '.env already exists',
      choices: [
        { name: 'Check existing setup', value: 'check' },
        { name: 'Reconfigure (overwrite .env)', value: 'reconfigure' },
      ],
    },
  ])
  if (mode === 'check') {
    await runCheck()
    process.exit(0)
  }
}

const { environment } = await ask([
  {
    type: 'list',
    name: 'environment',
    message: 'Target environment',
    choices: [
      { name: 'Production (bigcommerce.com)', value: 'bigcommerce.com' },
      { name: 'Staging (bigcommerce.zone)', value: 'bigcommerce.zone' },
    ],
  },
])

const { storeHash } = await ask([
  {
    type: 'input',
    name: 'storeHash',
    message: 'Store hash',
    validate: (v) => !!v.trim() || 'Required',
  },
])

const portalUrl =
  environment === 'bigcommerce.zone'
    ? 'https://build.integration.zone/'
    : 'https://devtools.bigcommerce.com'

console.log(chalk.dim(`Opening ${portalUrl}…`))
openUrl(portalUrl)
await pause('Click "Create App", give it a name, and click "Generate Credentials". Press Enter when the credentials modal appears.')

const { clientId, clientSecret, accountUuid } = await ask([
  {
    type: 'input',
    name: 'clientId',
    message: 'Client ID',
    validate: (v) => !!v.trim() || 'Required',
  },
  {
    type: 'password',
    name: 'clientSecret',
    message: 'Client Secret',
    mask: '•',
    validate: (v) => !!v.trim() || 'Required',
  },
  {
    type: 'input',
    name: 'accountUuid',
    message: 'Account UUID',
    validate: (v) => !!v.trim() || 'Required',
  },
])

await pause('Click "Finish" to close the modal, then press Enter.')

console.log(
  chalk.dim('\n  Back in devtools → your app → Scopes tab.\n') +
    `  Select ${chalk.bold('"Modify all"')} (recommended for testing), save, then click "Confirm scope changes".\n`
)
await pause('Press Enter once you have confirmed the scope changes.')

console.log(
  '\n' +
    chalk.bold('  Start a tunnel to expose your local dev server:\n') +
    `  ${chalk.dim('Install  ')}  brew install ngrok/ngrok/ngrok\n` +
    `  ${chalk.dim('Auth     ')}  ngrok config add-authtoken <your-token>  ${chalk.dim('(ngrok.com → Your Authtoken)')}\n` +
    `  ${chalk.dim('Run      ')}  ngrok http 3000\n` +
    `  ${chalk.dim('Copy     ')}  the Forwarding https://… URL\n`
)
const { tunnelUrl } = await ask([
  {
    type: 'input',
    name: 'tunnelUrl',
    message: 'Tunnel URL',
    validate: (v) => (v.startsWith('https://') ? true : 'Must be an https URL'),
  },
])

const cleanTunnel = tunnelUrl.trim().replace(/\/$/, '')
const authCallback = `${cleanTunnel}/api/auth`

console.log(
  '\n' +
    chalk.bold('  Set these in devtools → your app → App information → Callback URLs:\n') +
    `  ${chalk.dim('Auth      ')}  ${authCallback}\n` +
    `  ${chalk.dim('Load      ')}  ${cleanTunnel}/api/load\n` +
    `  ${chalk.dim('Uninstall ')}  ${cleanTunnel}/api/uninstall\n`
)
await pause('Press Enter once you have saved the callback URLs in devtools.')

const storeHost =
  environment === 'bigcommerce.zone'
    ? `store-${storeHash.trim()}.my-integration.zone`
    : `store-${storeHash.trim()}.mybigcommerce.com`

const settingsUrl = `https://${storeHost}/manage/settings-list`
console.log(chalk.dim(`\n  Opening ${settingsUrl}`))
console.log(
  '  → Settings → API → Account-level API accounts → Manage API tokens → Open → Create Account-level API account.\n' +
    `  Give it a name (e.g. ${chalk.italic('Blobfish Commerce dev')}), then enable these scopes:\n` +
    `  ${chalk.dim('Subscriptions  ')}  Read, Cancel\n` +
    `  ${chalk.dim('Checkouts      ')}  Read, Create\n` +
    `  ${chalk.dim('Charges        ')}  Create, Delete\n` +
    `  ${chalk.dim('Account        ')}  Read\n`
)
openUrl(settingsUrl)
await pause('Create the token and keep the credentials modal open. Press Enter when you see the "BigCommerce API credentials" modal.')

console.log(chalk.yellow('\n  ⚠  The Access token is shown only once — copy it now before clicking Done.\n'))
const { accountApiToken } = await ask([
  {
    type: 'password',
    name: 'accountApiToken',
    message: 'Access token',
    mask: '•',
    validate: (v) => !!v.trim() || 'Required',
  },
])

console.log(
  chalk.dim(
    '\n  App ID: open your app in the store control panel and copy the number from the URL.\n  (e.g. /manage/marketplace/apps/43250 → 43250)'
  )
)
const { appProductId } = await ask([
  {
    type: 'input',
    name: 'appProductId',
    message: 'App ID',
    default: '',
  },
])

const jwtKey = randomBytes(32).toString('hex')
const isStaging = environment === 'bigcommerce.zone'
const loginUrl = isStaging ? 'login.integration.zone' : `login.${environment}`
const apiUrl = isStaging ? 'api.integration.zone' : `api.${environment}`

writeFileSync(
  '.env',
  `# ${portalUrl}
CLIENT_ID=${clientId.trim()}
CLIENT_SECRET=${clientSecret.trim()}

# Tunnel URL (update when ngrok restarts)
AUTH_CALLBACK=${authCallback}
APP_URL=${cleanTunnel}

# Auto-generated
JWT_KEY=${jwtKey}

BC_ACCOUNT_UUID=${accountUuid.trim()}
BC_ACCOUNT_API_TOKEN=${accountApiToken.trim()}
BC_APP_PRODUCT_ID=${appProductId.trim()}

DB_TYPE=sqlite
ENVIRONMENT=${environment}
LOGIN_URL=${loginUrl}
API_URL=${apiUrl}
`
)
console.log(chalk.green('\n✓  .env written\n'))

console.log(chalk.bold('Setup complete\n'))
console.log('  npm install')
console.log('  npm run generate-schema')
console.log('  npm run dev\n')
