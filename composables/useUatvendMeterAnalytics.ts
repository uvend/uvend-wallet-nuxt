import useUatvendAuthFetch from '~/composables/useUatvendAuthFetch'

export async function fetchUatvendMeterAnalytics(identifiers: Array<string | number>) {
  const candidates = Array.from(
    new Set(
      (identifiers || [])
        .map((value) => (value === null || value === undefined ? '' : String(value).trim()))
        .filter((value) => value.length > 0),
    ),
  )
  if (candidates.length === 0) return null

  const endpoints = ['/meters', '/meter']

  for (let candidateIndex = 0; candidateIndex < candidates.length; candidateIndex += 1) {
    const encoded = encodeURIComponent(candidates[candidateIndex])
    for (let endpointIndex = 0; endpointIndex < endpoints.length; endpointIndex += 1) {
      const endpoint = `${endpoints[endpointIndex]}/${encoded}`
      try {
        return await useUatvendAuthFetch(endpoint, {
          query: { includeReadings: true },
        })
      } catch (error: any) {
        const status = error?.response?.status || error?.statusCode
        if (status === 404) {
          continue
        }
        throw error
      }
    }
  }

  return null
}
