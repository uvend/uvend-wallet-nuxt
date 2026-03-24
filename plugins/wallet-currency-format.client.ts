import { useWalletCurrencyStore } from '~/stores/walletCurrency'

export default defineNuxtPlugin(() => {
  const store = useWalletCurrencyStore()
  store.initFromRuntimeConfig()

  void store.fetchCurrency()

  const formatWalletCurrency = (
    value: number | string | null | undefined,
    opts?: Intl.NumberFormatOptions,
  ) => store.formatValue(value, opts)

  return {
    provide: {
      currency: formatWalletCurrency,
    },
  }
})
