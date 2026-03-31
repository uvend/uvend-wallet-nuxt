import { defineStore } from 'pinia'

export const useWalletCurrencyStore = defineStore('walletCurrency', {
  state: () => ({
    currency: 'R' as string,
    loadedFromApi: false,
  }),
  getters: {
    currencyCode: (s) => s.currency,
  },
  actions: {
    initFromRuntimeConfig() {
      const config = useRuntimeConfig()
      const fromEnv = String((config.public as { walletCurrencyCode?: string }).walletCurrencyCode || '').trim()
      if (fromEnv) this.currency = fromEnv
    },
    formatValue(
      value: number | string | null | undefined,
      options?: Intl.NumberFormatOptions,
    ): string {
      const num = Number(value ?? 0)
      try {
        const formatted = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          ...options,
        }).format(num)
        return `${this.currency} ${formatted}`
      } catch {
        return `${this.currency} ${num.toFixed(2)}`
      }
    },
    async fetchCurrency() {
      this.initFromRuntimeConfig()
      if (typeof localStorage === 'undefined') return
      const token = localStorage.getItem('wallet-access-token')
      if (!token) return
      try {
        const res = await useWalletAuthFetch('/account/currency') as { currency?: string }
        if (res?.currency) {
          this.currency = String(res.currency).trim()
          this.loadedFromApi = true
        }
      } catch {
        this.initFromRuntimeConfig()
      }
    },
  },
})
