export type CurrencyFormatOptions = {
  prefix?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export function useCurrency(defaultOptions: CurrencyFormatOptions = {}) {
  const defaults: Required<CurrencyFormatOptions> = {
    prefix: defaultOptions.prefix ?? 'R ',
    minimumFractionDigits: defaultOptions.minimumFractionDigits ?? 2,
    maximumFractionDigits: defaultOptions.maximumFractionDigits ?? 2,
  }

  function formatCurrency(
    value: number | string | null | undefined,
    opts: CurrencyFormatOptions = {},
  ): string {
    const num = Number(value ?? 0)
    const options = {
      minimumFractionDigits: opts.minimumFractionDigits ?? defaults.minimumFractionDigits,
      maximumFractionDigits: opts.maximumFractionDigits ?? defaults.maximumFractionDigits,
    }
    try {
      const formatted = new Intl.NumberFormat('en-US', options).format(num)
      return `${opts.prefix ?? defaults.prefix}${formatted}`
    }
    catch {
      return `${opts.prefix ?? defaults.prefix}${num.toFixed(options.minimumFractionDigits)}`
    }
  }

  return { formatCurrency }
}

