type RuntimeConfig = {
  hexingApiUsername?: string
  hexingApiPassword?: string
  hexingApiToken?: string
  hexingBasicAuth?: string
  m2mApiUsername?: string
  m2mApiPassword?: string
  m2mApiToken?: string
  m2mBasicAuth?: string
}

function toBasicToken(username?: string, password?: string) {
  if (!username || !password) return ''
  return Buffer.from(`${username}:${password}`).toString('base64')
}

export function buildAuthHeaders(config: RuntimeConfig = {}) {
  const token =
    config.hexingApiToken ||
    config.m2mApiToken ||
    process.env.HEXING_API_TOKEN ||
    process.env.M2M_API_TOKEN

  const basicAuth =
    config.hexingBasicAuth ||
    config.m2mBasicAuth ||
    process.env.HEXING_BASIC_AUTH ||
    process.env.M2M_BASIC_AUTH

  const username =
    config.hexingApiUsername ||
    config.m2mApiUsername ||
    process.env.HEXING_API_USERNAME ||
    process.env.M2M_API_USERNAME

  const password =
    config.hexingApiPassword ||
    config.m2mApiPassword ||
    process.env.HEXING_API_PASSWORD ||
    process.env.M2M_API_PASSWORD

  const headers: Record<string, string> = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
    return headers
  }

  if (basicAuth) {
    headers.Authorization = `Basic ${basicAuth}`
    return headers
  }

  const basicToken = toBasicToken(username, password)
  if (basicToken) {
    headers.Authorization = `Basic ${basicToken}`
  }

  return headers
}
