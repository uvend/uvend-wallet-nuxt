const config = useRuntimeConfig();
const walletApiUrl = config.public.walletApiUrl;

export default async function fetch<T>(url: string, options: any = {}, retry = true): Promise<T | null> {
  try {
    const accessToken = localStorage.getItem('wallet-access-token');
    const refreshToken = localStorage.getItem('wallet-refresh-token');

    return await $fetch<T>(`${walletApiUrl}${url}`, {
      headers: {
        'X-Stack-Access-Token': accessToken,
        'X-Stack-Refresh-Token': refreshToken,
        ...options.headers,
      },
      ...options,
    });
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
    }
    return error;
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
