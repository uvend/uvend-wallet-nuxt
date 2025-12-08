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
  const serial = getRouterParam(event, 'serial')
  
  if (!serial) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Serial number is required'
    })
  }

  const url = `${m2mApiUrl}/devices/serial/${serial}`
  console.log('[M2M Proxy] GET', url)

  try {
    const response = await $fetch(url)
    console.log('[M2M Proxy] Success serial lookup', { serial })
    return response
  } catch (error: any) {
    console.error('[M2M Proxy] Failed serial lookup', { serial, details: buildErrorDetails(error) })
    throw createError({
      statusCode: error?.statusCode || error?.response?.status || 500,
      statusMessage: error?.statusMessage || error?.response?.statusMessage || 'Failed to fetch device'
    })
  }
})

