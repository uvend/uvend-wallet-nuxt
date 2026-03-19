<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm">
        <Icon name="lucide:smartphone" class="h-5 w-5 text-blue-700" />
      </div>
      <div>
        <h4 class="text-lg font-semibold text-gray-900">Top up via M‑Pesa</h4>
        <p class="text-sm text-gray-600">
          Review the amount and provide the M‑Pesa mobile number to complete your top‑up.
        </p>
      </div>
    </div>

    <!-- Amount summary -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p class="text-xs font-medium text-blue-700 uppercase tracking-wide">Amount to be debited</p>
        <p class="mt-1 text-2xl font-bold text-blue-900">
          {{ formattedAmount }}
        </p>
      </div>
      <div v-if="accountNumber" class="text-right">
        <p class="text-xs text-gray-500">Wallet account number</p>
        <p class="mt-1 text-sm font-mono font-semibold text-gray-900">
          {{ accountNumber }}
        </p>
      </div>
    </div>

    <!-- Phone capture -->
    <div class="space-y-3">
      <Label class="text-sm font-semibold text-gray-800">
        M‑Pesa mobile number
      </Label>
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="sm:w-48">
          <Select v-model="selectedCode">
            <SelectTrigger class="w-full bg-white border-gray-200 rounded-xl">
              <SelectValue placeholder="Country code" />
            </SelectTrigger>
            <SelectContent class="max-h-64">
              <SelectItem
                v-for="code in countryCodeOptions"
                :key="code"
                :value="code"
              >
                {{ code }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          v-model="phoneNumber"
          type="tel"
          inputmode="tel"
          placeholder="712 345 678"
          class="flex-1 h-11 rounded-xl"
        />
      </div>
      <p class="text-xs text-gray-500">
        Use the Kenyan M‑Pesa number that will be debited for this top‑up.
      </p>
    </div>

    <!-- Info text -->
    <div class="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-start gap-2">
      <Icon name="lucide:info" class="h-4 w-4 text-gray-500 mt-0.5" />
      <p class="text-xs text-gray-600">
        Once you complete the payment in the M‑Pesa app, your Uvend wallet balance will be updated automatically. 
        This may take a few minutes to reflect.
      </p>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-2">
      <Button
        variant="outline"
        class="flex-1 border-gray-300 hover:bg-gray-50 rounded-xl"
        @click="$emit('close')"
      >
        Back
      </Button>
      <Button
        class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold"
        :disabled="!canContinue || isSubmitting"
        @click="initiateMpesa"
      >
        Continue in M‑Pesa
      </Button>
    </div>
  </div>
</template>

<script>
import { useCountryCodes } from '~/stores/country-codes'

export default {
  name: 'WalletMpesaPay',
  props: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'R' },
    accountNumber: { type: String, default: '' }
  },
  data() {
    const { myCountryCodesObject } = useCountryCodes()
    let options = []
    if (myCountryCodesObject) {
      const entries = Object.entries(myCountryCodesObject)
      // Prefer Kenya (KES) entry
      const kenyaEntry = entries.find(([code, label]) => code === 'KE' || label.includes('Kenya'))
      if (kenyaEntry) {
        options = [kenyaEntry[1]]
      }
    }

    return {
      countryCodeOptions: options,
      selectedCode: options[0] || '',
      phoneNumber: '',
      isSubmitting: false
    }
  },
  computed: {
    formattedAmount() {
      const { $currency } = useNuxtApp()
      const numericAmount = Number(this.amount || 0)
      return $currency ? $currency(numericAmount) : `${this.currency} ${numericAmount.toFixed(2)}`
    },
    canContinue() {
      return Boolean(this.selectedCode && this.phoneNumber && this.phoneNumber.trim().length >= 5)
    },
    selectedPrefix() {
      // Extract the +countryCallingCode from the label, e.g. "[KE] Kenya: +254"
      if (!this.selectedCode) return ''
      const match = this.selectedCode.match(/(\+\d+)/)
      return match ? match[1] : ''
    }
  },
  methods: {
    async initiateMpesa() {
      if (!this.canContinue || this.isSubmitting) return
      this.isSubmitting = true
      try {
        const rawPhone = this.phoneNumber.trim()
        const msisdn = `${this.selectedPrefix}${rawPhone.replace(/^0+/, '')}`
        const body = {
          amount: Number(this.amount || 0),
          phoneNumber: msisdn
        }
        const response = await useWalletAuthFetch(`/mpesa/initiate`, {
          method: 'POST',
          body
        })
        console.log('M‑Pesa initiate response', response)
        this.$toast?.({
          title: 'M‑Pesa initiated',
          description: 'Follow the instructions in your M‑Pesa app to complete the payment.'
        })
        // Optionally close back to payment tab
        this.$emit('close')
      } catch (error) {
        console.error('Error initiating M‑Pesa payment:', error)
        this.$toast?.({
          title: 'M‑Pesa error',
          description: 'We could not start your M‑Pesa payment. Please try again.',
          variant: 'destructive'
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
</style>

