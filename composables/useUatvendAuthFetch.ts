type UatvendAuthResponse = {
  success?: boolean
  message?: string
  data?: any
  access_token?: string
  refresh_token?: string
  accessToken?: string
  refreshToken?: string
  token?: string
  jwt?: string
  [key: string]: any
}

const ACCESS_TOKEN_KEY = 'uatvend-access-token'
const REFRESH_TOKEN_KEY = 'uatvend-refresh-token'

export function getUatvendAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getUatvendRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setUatvendTokens(tokens: { access_token?: string; refresh_token?: string }) {
  if (typeof window === 'undefined') return
  if (tokens.access_token) localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)
  if (tokens.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
    console.log('[UVEND2] Saved uatvend-refresh-token')
  }
}

function extractTokens(payload: any) {
  const access =
    payload?.access_token ||
    payload?.accessToken ||
    payload?.token ||
    payload?.jwt ||
    null
  const refresh = payload?.refresh_token || payload?.refreshToken || null
  return { access, refresh }
}

async function refreshUatvendToken(): Promise<boolean> {
  try {
    const refreshToken = getUatvendRefreshToken()
    if (!refreshToken) return false

    const refreshEndpoints = ['/auth/refresh', '/refresh']
    for (const endpoint of refreshEndpoints) {
      try {
        const refreshed: any = await $fetch(`/api/uatvend${endpoint}`, {
          method: 'POST',
          headers: {
            'X-Stack-Refresh-Token': refreshToken,
          },
          credentials: 'include',
        })
        const payload = refreshed?.data || refreshed
        const { access, refresh } = extractTokens(payload)
        if (access) {
          setUatvendTokens({
            access_token: String(access),
            ...(refresh ? { refresh_token: String(refresh) } : {}),
          })
          return true
        }
      } catch (error) {
        // Try the next refresh endpoint
      }
    }

    return false
  } catch (error) {
    console.error('[UATVend] Token refresh failed', error)
    return false
  }
}

export async function refreshUatvendTokenDirect(baseUrl: string): Promise<boolean> {
  try {
    const refreshToken = getUatvendRefreshToken()
    if (!refreshToken) return false

    const cleanBase = String(baseUrl || 'https://api.uatvend.co.za').replace(/\/+$/, '')
    const refreshEndpoints = ['/auth/refresh', '/refresh']

    for (const endpoint of refreshEndpoints) {
      try {
        const refreshed: any = await $fetch(`${cleanBase}${endpoint}`, {
          method: 'POST',
          headers: {
            'X-Stack-Refresh-Token': refreshToken,
          },
        })
        const payload = refreshed?.data || refreshed
        const { access, refresh } = extractTokens(payload)
        if (access) {
          setUatvendTokens({
            access_token: String(access),
            ...(refresh ? { refresh_token: String(refresh) } : {}),
          })
          return true
        }
      } catch {
        // Try next endpoint
      }
    }
    return false
  } catch (error) {
    console.error('[UVEND2] Direct token refresh failed', error)
    return false
  }
}

export default async function useUatvendAuthFetch<T>(
  url: string,
  options: any = {},
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers || {}),
  }

  const isAuthEndpoint =
    url.includes('/auth/sign-in') ||
    url.includes('/auth/sign-up') ||
    url.includes('/auth/refresh') ||
    url.includes('/sign-in') ||
    url.includes('/sign-up') ||
    url.includes('/refresh')

  const token = getUatvendAccessToken()
  const refreshToken = getUatvendRefreshToken()

  if (!isAuthEndpoint && token) {
    if (!headers.Authorization && !headers.authorization) {
      headers.Authorization = `Bearer ${token}`
    }
    if (!headers['X-Stack-Access-Token'] && !headers['x-stack-access-token']) {
      headers['X-Stack-Access-Token'] = token
    }
  }
  if (!isAuthEndpoint && refreshToken) {
    if (!headers['X-Stack-Refresh-Token'] && !headers['x-stack-refresh-token']) {
      headers['X-Stack-Refresh-Token'] = refreshToken
    }
  }

  const method = options.method || 'GET'
  const body = options.body

  try {
    return await $fetch<T>(`/api/uatvend${url}`, {
      method,
      headers,
      credentials: 'include',
      ...(body !== undefined ? { body } : {}),
      ...(options.params ? { params: options.params } : {}),
      ...(options.query ? { query: options.query } : {}),
    })
  } catch (error: any) {
    if (error?.response?.status === 401 && retry) {
      const refreshed = await refreshUatvendToken()
      if (refreshed) {
        return await useUatvendAuthFetch<T>(url, options, false)
      }
    }
    throw error
  }
}

export async function uatvendSignIn(email: string, password: string): Promise<UatvendAuthResponse> {
  const config = useRuntimeConfig()
  const baseUrl = String((config.public as any)?.uatvendApiUrl || 'https://api.uatvend.co.za').replace(/\/+$/, '')
  const res = await $fetch<UatvendAuthResponse>(`${baseUrl}/auth/sign-in`, {
    method: 'POST',
    body: { email, password },
  })

  const payload: any = (res as any)?.data || res
  const { access, refresh } = extractTokens(payload)

  if (access) {
    setUatvendTokens({
      access_token: String(access),
      ...(refresh ? { refresh_token: String(refresh) } : {}),
    })
  }
  return res
}

export async function uatvendSignUp(email: string, password: string): Promise<UatvendAuthResponse> {
  const config = useRuntimeConfig()
  const baseUrl = String((config.public as any)?.uatvendApiUrl || 'https://api.uatvend.co.za').replace(/\/+$/, '')
  const endpoints = ['/auth/sign-up', '/sign-up']
  let lastError: any = null

  for (const endpoint of endpoints) {
    try {
      const res = await $fetch<UatvendAuthResponse>(`${baseUrl}${endpoint}`, {
        method: 'POST',
        body: { email, password },
      })

      const payload: any = (res as any)?.data || res
      const { access, refresh } = extractTokens(payload)

      if (access) {
        setUatvendTokens({
          access_token: String(access),
          ...(refresh ? { refresh_token: String(refresh) } : {}),
        })
      }
      return res
    } catch (error) {
      lastError = error
    }
  }

  if (lastError) throw lastError
  return { success: false, message: 'UVEND2 sign-up failed' }
}
