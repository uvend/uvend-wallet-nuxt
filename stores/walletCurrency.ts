import { defineStore } from 'pinia'

const ISO_CODE = /^[A-Za-z]{3}$/
const CURRENCY_ALIASES: Record<string, string> = {
  KSHS: 'Kshs',
  KSH: 'Kshs',
  KES: 'Kshs',
  RAND: 'R',
  R: 'R',
  ZAR: 'R',
}

function normalizeCode(raw: unknown): string | null {
  if (raw == null || typeof raw !== 'string') return null
  const c = raw.trim().toUpperCase()
  if (CURRENCY_ALIASES[c]) return CURRENCY_ALIASES[c]
  const compact = c.replace(/[^A-Z]/g, '')
  if (CURRENCY_ALIASES[compact]) return CURRENCY_ALIASES[compact]
  return ISO_CODE.test(c) ? c : null
}

function pickCurrencyFromResponse(res: unknown): string | null {
  if (!res || typeof res !== 'object') return null
  const r = res as Record<string, unknown>
  const data = r.data
  const d = data && typeof data === 'object' ? (data as Record<string, unknown>) : null
  const candidates = [
    d?.currency,
    d?.currencyCode,
    d?.code,
    r.currency,
    r.currencyCode,
    r.code,
  ]
  for (const c of candidates) {
    const n = normalizeCode(c)
    if (n) return n
  }
  return null
}

export const useWalletCurrencyStore = defineStore('walletCurrency', {
  state: () => ({
    isoCode: 'ZAR' as string,
    loadedFromApi: false,
  }),
  getters: {
    currencyCode: (s) => s.isoCode,
  },
  actions: {
    initFromRuntimeConfig() {
      const config = useRuntimeConfig()
      const fromEnv = normalizeCode((config.public as { walletCurrencyCode?: string }).walletCurrencyCode)
      if (fromEnv) this.isoCode = fromEnv
    },
    formatValue(
      value: number | string | null | undefined,
      options?: Intl.NumberFormatOptions,
    ): string {
      const num = Number(value ?? 0)
      const code = this.isoCode
      try {
        return new Intl.NumberFormat('en-ZA', {
          style: 'currency',
          currency: code,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          ...options,
        }).format(num)
      } catch {
        return `${code} ${num.toFixed(2)}`
      }
    },
    async fetchCurrency() {
      this.initFromRuntimeConfig()
      if (typeof localStorage === 'undefined') return
      const token = localStorage.getItem('wallet-access-token')
      if (!token) return
      try {
        const res = await useWalletAuthFetch('/account/currency')
        const code = pickCurrencyFromResponse(res)
        if (code) {
          this.isoCode = code
          this.loadedFromApi = true
        }
      } catch {
        this.initFromRuntimeConfig()
      }
    },
  },
})
