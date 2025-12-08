import { defineEventHandler, getRouterParam } from 'h3'

const config = useRuntimeConfig()
const m2mApiUrl = config.hexingApiUrl || process.env.HEXING_API || 'https://api.m2m.co.za'

function buildErrorDetails(error: any) {
  return {
    message: error?.message,
    statusCode: error?.statusCode || error?.response?.status,
    statusMessage: error?.statusMessage || error?.response?.statusMessage,
    data: error?.data || error?.response?._data,
  }
}

export default defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, 'id')
  
  if (!deviceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device ID is required'
    })
  }

  const url = `${m2mApiUrl}/devices/${deviceId}/registers/readings`
  console.log('[M2M Proxy] GET', url)

  try {
    const response = await $fetch(url)
    console.log('[M2M Proxy] Success device readings', { deviceId })
    return response
  } catch (error: any) {
    console.error('[M2M Proxy] Failed device readings', { deviceId, details: buildErrorDetails(error) })
    throw createError({
      statusCode: error?.statusCode || error?.response?.status || 500,
      statusMessage: error?.statusMessage || error?.response?.statusMessage || 'Failed to fetch device readings'
    })
  }
})

