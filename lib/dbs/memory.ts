import { SessionProps, StoreData, UserData } from '../../types'

interface StoreRecord extends StoreData {
  adminId?: number
}

interface StoreUserRecord {
  isAdmin: boolean
  storeHash: string
  userId: string
}

const stores = new Map<string, StoreRecord>()
const storeUsers = new Map<string, StoreUserRecord>()
const users = new Map<string, UserData>()

function getStoreHash(session: SessionProps) {
  const contextString = session.context ?? session.sub

  return contextString?.split('/')[1] || ''
}

function getStoreUserKey(userId: string | number, storeHash: string) {
  return `${String(userId)}_${storeHash}`
}

export async function setUser({ user }: SessionProps) {
  if (!user) return null

  const { email, id, username } = user
  const data: UserData = { email }

  if (username) {
    data.username = username
  }

  users.set(String(id), data)
}

export async function setStore(session: SessionProps) {
  const {
    access_token: accessToken,
    context,
    scope,
    user: { id },
  } = session

  if (!accessToken || !scope) return null

  const storeHash = context?.split('/')[1] || ''
  stores.set(storeHash, { accessToken, adminId: id, scope, storeHash })

  // eslint-disable-next-line no-console
  console.log('Store set:', stores.get(storeHash))
}

export async function setStoreUser(session: SessionProps) {
  const {
    access_token: accessToken,
    owner,
    user: { id: userId },
  } = session
  if (!userId) return null

  const storeHash = getStoreHash(session)
  const key = getStoreUserKey(userId, storeHash)
  const storeUser = storeUsers.get(key)

  if (accessToken) {
    if (!storeUser) {
      storeUsers.set(key, { isAdmin: true, storeHash, userId: String(userId) })
    } else if (!storeUser.isAdmin) {
      storeUsers.set(key, { ...storeUser, isAdmin: true })
    }
  } else if (!storeUser) {
    storeUsers.set(key, {
      isAdmin: owner?.id === userId,
      storeHash,
      userId: String(userId),
    })
  }

  // eslint-disable-next-line no-console
  console.log('StoreUser set:', storeUsers.get(key))
}

export async function deleteUser({ context, user, sub }: SessionProps) {
  const contextString = context ?? sub
  const storeHash = contextString?.split('/')[1] || ''
  const key = getStoreUserKey(user?.id, storeHash)

  storeUsers.delete(key)

  // eslint-disable-next-line no-console
  console.log('StoreUser deleted:', key)
}

export async function hasStoreUser(storeHash: string, userId: string) {
  if (!storeHash || !userId) return false

  const result = storeUsers.has(getStoreUserKey(userId, storeHash))

  // eslint-disable-next-line no-console
  console.log(
    `Checking store user for storeHash: ${storeHash}, userId: ${userId} - Result: ${result}`
  )

  return result
}

export async function getStoreToken(storeHash: string) {
  if (!storeHash) return null

  const result = stores.get(storeHash)?.accessToken ?? null

  // eslint-disable-next-line no-console
  console.log(
    `Getting store token for storeHash: ${storeHash} - Result: ${result}`
  )

  return result
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
  if (!storeHash) return

  stores.delete(storeHash)
}
