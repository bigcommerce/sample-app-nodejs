/* eslint-disable no-console */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') return

  const original = globalThis.fetch

  globalThis.fetch = async function (input, init) {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : (input as Request).url
    const method =
      init?.method ?? (input instanceof Request ? input.method : 'GET')

    console.log(`\n[http] → ${method} ${url}`)
    if (init?.body && typeof init.body === 'string') {
      try {
        console.log('[http] body:', JSON.parse(init.body))
      } catch {
        console.log('[http] body:', init.body)
      }
    }

    const res = await original(input, init)

    console.log(`[http] ← ${res.status} ${url}`)
    try {
      const body = await res.clone().json()
      console.log('[http] response:', JSON.stringify(body, null, 2))
    } catch {
      // non-JSON response
    }

    return res
  }
}
