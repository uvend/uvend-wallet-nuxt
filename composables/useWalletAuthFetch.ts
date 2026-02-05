const config = useRuntimeConfig();
const walletApiUrl = config.public.walletApiUrl;
const clientId = config.public.clientId;
const clientSecret = config.public.clientSecret;

export default async function fetch<T>(url: string, options: any = {}, retry = true): Promise<T | null> {
  try {
    const accessToken = localStorage.getItem('wallet-access-token');
    const refreshToken = localStorage.getItem('wallet-refresh-token');

    // Build headers - only add auth headers if tokens exist and it's not an auth endpoint
    const isAuthEndpoint = url.includes('/auth/sign-in') || url.includes('/auth/sign-up') || url.includes('/auth/create') || url.includes('/auth/refresh');
    const headers: Record<string, string> = {
      ...options.headers,
    };

    // Only add Content-Type for non-GET requests if not already set
    if (options.method && options.method !== 'GET' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Add CLIENT_ID and CLIENT_SECRET to auth requests if available
    if (isAuthEndpoint && clientId && typeof clientId === 'string' && clientSecret && typeof clientSecret === 'string') {
      // Add to headers (common OAuth pattern)
      headers['X-Client-Id'] = clientId;
      headers['X-Client-Secret'] = clientSecret;
    }

    // Only add auth headers if we have tokens and it's not an auth endpoint
    if (!isAuthEndpoint && accessToken) {
      headers['X-Stack-Access-Token'] = accessToken;
    }
    if (!isAuthEndpoint && refreshToken) {
      headers['X-Stack-Refresh-Token'] = refreshToken;
    }

    // For auth endpoints, use original body (CLIENT_ID/CLIENT_SECRET are in headers only)
    let requestBody: any = options.body || {};

    // Log request details for auth endpoints to help debug
    if (isAuthEndpoint) {
      console.log('=== AUTH REQUEST DEBUG ===');
      console.log('URL:', `${walletApiUrl}${url}`);
      console.log('Method:', options.method || 'GET');
      console.log('Headers:', JSON.stringify(headers, null, 2));
      console.log('Body:', JSON.stringify(requestBody, null, 2));
      console.log('CLIENT_ID (in headers):', clientId || 'NOT SET');
      console.log('CLIENT_SECRET (in headers):', clientSecret ? '***SET***' : 'NOT SET');
      console.log('WALLET_API_URL:', walletApiUrl);
      console.log('========================');
    }
    
    // Use native fetch for auth endpoints to get better error visibility
    if (isAuthEndpoint && options.method && options.method !== 'GET') {
      try {
        const bodyString = JSON.stringify(requestBody);
        console.log('Sending body as string:', bodyString);
        
        const fetchResponse = await globalThis.fetch(`${walletApiUrl}${url}`, {
          method: options.method,
          headers,
          body: bodyString,
        });
        
        console.log('Response status:', fetchResponse.status);
        console.log('Response statusText:', fetchResponse.statusText);
        console.log('Response headers:', Object.fromEntries(fetchResponse.headers.entries()));
        
        const responseText = await fetchResponse.text();
        console.log('Raw response text:', responseText);
        
        if (!fetchResponse.ok) {
          let errorData: any = { error: 'Bad Request' };
          try {
            errorData = JSON.parse(responseText);
            console.error('Parsed error response:', errorData);
          } catch (e) {
            console.error('Response is not JSON, raw text:', responseText);
            errorData = { error: responseText || 'Bad Request' };
          }
          
          const error: any = new Error(`[${options.method}] "${walletApiUrl}${url}": ${fetchResponse.status}`);
          error.response = {
            status: fetchResponse.status,
            statusText: fetchResponse.statusText,
            headers: fetchResponse.headers,
            _data: errorData
          };
          error.data = errorData;
          throw error;
        }
        
        const responseData = JSON.parse(responseText);
        console.log('Success response:', responseData);
        return responseData as T;
      } catch (fetchError: any) {
        // If it's our custom error, re-throw it
        if (fetchError.response) {
          throw fetchError;
        }
        // Otherwise, wrap it
        console.error('Native fetch error:', fetchError);
        throw fetchError;
      }
    }
    
    // Use $fetch for non-auth endpoints
    const response = await $fetch<T>(`${walletApiUrl}${url}`, {
      headers,
      method: options.method,
      body: options.body,
      ...(options.params && { params: options.params }),
      ...(options.query && { query: options.query }),
    });
    return response;
  } catch (error: any) {
      // If 401, try to refresh and retry once
      if (error?.response?.status === 401 && retry) {
        const refreshed = await refreshTokenFlow();
        if (refreshed) {
          return await fetch<T>(url, options, false); // retry once, with retry = false
        } else {
          console.warn('Token refresh failed, redirecting to login');
          localStorage.clear()
          navigateTo('/login');
        }
      } else {
        console.error('Fetch error:', error);
        // Log the actual error response for debugging
        if (error?.response?._data) {
          console.error('Error response data:', error.response._data);
        }
        if (error?.data) {
          console.error('Error data:', error.data);
        }
        if (!error?.response?._data?.message && !error?.data?.message) {
          console.error('Unknown wallet error', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            url,
          });
        }
        if (error?.response) {
          console.error('Full error response:', {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            data: error.response._data
          });
          // Try to extract more details from headers
          if (error.response.headers) {
            const headersObj: any = {};
            error.response.headers.forEach((value: string, key: string) => {
              headersObj[key] = value;
            });
            console.error('Response headers:', headersObj);
          }
        }
        // Also log the full error object structure
        console.error('Full error object keys:', Object.keys(error));
        if (error?.cause) {
          console.error('Error cause:', error.cause);
        }
        if (error?.stack) {
          console.error('Error stack:', error.stack);
        }
      }
      // Re-throw the error instead of returning it, so calling code can catch it properly
      throw error;
    }
}

async function refreshTokenFlow(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem('wallet-refresh-token');
    if (!refreshToken) return false;
    const refreshUrl = `${walletApiUrl}/auth/refresh`;
    const res = await $fetch<{ access_token: string;}>(refreshUrl, {
      method: 'POST',
      headers: {
        'X-Stack-Refresh-Token': refreshToken,
      },
    });
    if (res.access_token) {
      localStorage.setItem('wallet-access-token', res.access_token);
      console.error('Refresh token request success');
      return true;
    }
    console.error('Refresh token request failed',res);
    return false;
  } catch (err) {
    console.error('Refresh token request failed:', err);
    return false;
  }
}
