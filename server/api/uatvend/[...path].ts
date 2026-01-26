import { defineEventHandler, getQuery, readBody, getHeader, setResponseStatus, setHeader } from 'h3'

/**
 * Generic proxy to the UVEND2 (UATVend) API.
 *
 * Client calls: /api/uatvend/<path>?query
 * Server forwards to: {runtimeConfig.uatvendApiUrl}/<path>?query
 *
 * - Forwards Authorization header (if present)
 * - Avoids CORS issues in the SPA
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = (config.uatvendApiUrl || 'https://api.uatvend.co.za').replace(/\/+$/, '')

  const localPath = event.path || ''
  const upstreamPath = localPath.replace(/^\/api\/uatvend\/?/, '')

  const query = getQuery(event)
  const methodUpper = (event.node.req.method || 'GET').toUpperCase()
  const method = (event.node.req.method || 'GET') as any

  const authorization = getHeader(event, 'authorization')
  const xStackAccessToken = getHeader(event, 'x-stack-access-token')
  const xStackRefreshToken = getHeader(event, 'x-stack-refresh-token')
  const contentType = getHeader(event, 'content-type')

  const headers: Record<string, string> = {
    accept: 'application/json',
  }
  if (authorization) {
    headers.authorization = authorization
  } else if (xStackAccessToken) {
    // Accept X-Stack-Access-Token and convert to Authorization if needed
    headers.authorization = `Bearer ${xStackAccessToken}`
  } else if (config.uatvendApiToken) {
    headers.authorization = `Bearer ${config.uatvendApiToken}`
  }
  if (xStackAccessToken) headers['x-stack-access-token'] = xStackAccessToken
  if (xStackRefreshToken) headers['x-stack-refresh-token'] = xStackRefreshToken
  if (contentType) headers['content-type'] = contentType

  const url = `${baseUrl}/${upstreamPath}`

  console.log('[UVEND2 Proxy]', methodUpper, url, {
    hasAuth: !!authorization || !!xStackAccessToken || !!config.uatvendApiToken,
  })

  const body =
    methodUpper === 'GET' || methodUpper === 'HEAD' ? undefined : await readBody(event).catch(() => undefined)

  try {
    const response = await $fetch.raw(url, {
      method,
      headers,
      query,
      ...(body !== undefined ? { body } : {}),
    })

    const setCookie =
      (response.headers as any)?.getSetCookie?.() ||
      response.headers?.get?.('set-cookie') ||
      null
    if (setCookie) setHeader(event, 'set-cookie', setCookie)

    return response._data
  } catch (error: any) {
    const statusCode = error?.statusCode || error?.response?.status || 500
    setResponseStatus(event, statusCode)
    return {
      message: error?.message || 'UVEND2 request failed',
      statusCode,
      data: error?.data || error?.response?._data,
    }
  }
})
