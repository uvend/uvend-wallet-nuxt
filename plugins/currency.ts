import { useCurrency } from '~/composables/useCurrency'

export default defineNuxtPlugin(() => {
  const { formatCurrency } = useCurrency()
  return {
    provide: {
      currency: formatCurrency,
    },
  }
})

