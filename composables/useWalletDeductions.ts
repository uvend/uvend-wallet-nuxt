type WalletDeductionResponse = {
  account?: string
  wallet_balance?: string | number
  deduction_amount?: number
  message?: string
  [key: string]: any
}

export default function useWalletDeductions() {
  const config = useRuntimeConfig()
  const vendUrl = String((config.public as any)?.vendUrl || '').replace(/\/+$/, '')
  const vendTerminalId = (config.public as any)?.vendTerminalId || ''
  const vendOperatorId = (config.public as any)?.vendOperatorId || ''

  const blockMeter = async (meterNumber: string, state = true) => {
    if (!vendUrl || !meterNumber) return null
    return await $fetch(`${vendUrl}/MeterVend/SetMeterBlockState`, {
      method: 'GET',
      params: {
        Block: state,
        MeterNumber: meterNumber,
        'ApiUserParams.TerminalID': vendTerminalId,
        'ApiUserParams.OperatorID': vendOperatorId,
        'ApiUserParams.RequestID': new Date().toISOString(),
      },
    })
  }

  const blockAllMeters = async (meterNumbers: string[]) => {
    if (!Array.isArray(meterNumbers) || meterNumbers.length === 0) return
    await Promise.all(
      meterNumbers.map((meterNumber) => blockMeter(String(meterNumber), true)),
    )
  }

  const deductFromWallet = async (
    accountNumber: string,
    deductionAmount: number,
  ): Promise<WalletDeductionResponse | null> => {
    if (!accountNumber) {
      throw new Error('Account number is required')
    }
    if (Number.isNaN(Number(deductionAmount))) {
      throw new Error('Deduction amount must be a number')
    }

    return await useWalletAuthFetch<WalletDeductionResponse>(`/account/deduct`, {
      method: 'POST',
      body: {
        accountNumber,
        deductionAmount,
      },
    })
  }

  const getWalletBalance = async (): Promise<number> => {
    const response = await useWalletAuthFetch<{ balance?: number | string }>(`/pay/balance`)
    const value = Number(response?.balance ?? 0)
    return Number.isNaN(value) ? 0 : value
  }

  const deductAndBlockIfNeeded = async (
    accountNumber: string,
    deductionAmount: number,
    meterNumbers: string[],
  ): Promise<WalletDeductionResponse | null> => {
    const startingBalance = await getWalletBalance()
    const newBalance = Number(startingBalance) - Number(deductionAmount)
    const response = await deductFromWallet(accountNumber, deductionAmount)

    if (!response) {
      return response
    }

    // Force wallet balance to reflect deduction result (including negatives)
    response.wallet_balance = Number.isNaN(newBalance) ? response.wallet_balance : newBalance

    if (!Number.isNaN(startingBalance) && Number(deductionAmount) > Number(startingBalance)) {
      await blockAllMeters(meterNumbers)
    }
    return response
  }

  return {
    deductFromWallet,
    deductAndBlockIfNeeded,
  }
}
