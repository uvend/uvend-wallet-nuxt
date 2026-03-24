<template>
  <div class="space-y-5">
    <!-- Header banner -->
    <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-5 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-14 translate-x-14"></div>
      <div class="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Icon name="lucide:smartphone" class="h-6 w-6 text-white" />
        </div>
        <div>
          <h4 class="text-lg font-bold">Top up via M‑Pesa</h4>
          <p class="text-sm text-white/80">Enter your details below to continue.</p>
        </div>
      </div>
    </div>

    <!-- Amount + Account row -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount</p>
        <p class="text-xl font-bold text-gray-900">{{ formattedAmount }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Account</p>
        <p class="text-xl font-bold text-gray-900 font-mono" v-if="accountNumber">{{ accountNumber }}</p>
        <p class="text-sm text-gray-400" v-else>—</p>
      </div>
    </div>

    <!-- Phone capture -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
      <Label class="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <Icon name="lucide:phone" class="h-4 w-4 text-gray-500" />
        M‑Pesa mobile number
      </Label>
      <div class="flex gap-2">
        <div class="w-36 shrink-0">
          <Select v-model="selectedCode">
            <SelectTrigger class="w-full bg-gray-50 border-gray-200 rounded-lg h-11 text-sm">
              <SelectValue placeholder="Code" />
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
          class="flex-1 h-11 rounded-lg bg-gray-50 border-gray-200"
        />
      </div>
      <p class="text-xs text-gray-400">
        Ensure this is the number registered on your M‑Pesa account.
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="isSubmitting" class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
      <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
      <span class="text-sm font-medium text-blue-800">Initiating M‑Pesa payment request…</span>
    </div>

    <!-- Success state -->
    <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon name="lucide:check-circle" class="h-5 w-5 text-green-600" />
      </div>
      <div>
        <p class="text-sm font-semibold text-green-800">Request sent successfully</p>
        <p class="text-sm text-green-700 mt-0.5">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Info note -->
    <div class="flex items-start gap-2 px-1">
      <Icon name="lucide:info" class="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
      <p class="text-xs text-gray-400 leading-relaxed">
        Your Uvend wallet balance will be updated automatically once the payment is confirmed. This may take a few moments.
      </p>
    </div>

    <!-- Actions -->
    <div class="flex gap-3">
      <Button
        variant="outline"
        class="flex-1 border-gray-200 hover:bg-gray-50 rounded-xl h-11"
        @click="$emit('close')"
      >
        <Icon name="lucide:arrow-left" class="h-4 w-4 mr-2" />
        Back
      </Button>
      <Button
        class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold h-11 shadow-md hover:shadow-lg transition-all duration-200"
        :disabled="!canContinue || isSubmitting"
        @click="initiateMpesa"
      >
        <Icon name="lucide:send" class="h-4 w-4 mr-2" />
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
      const kenyaEntry = entries.find(([code, label]) => code === 'KE' || label.includes('Kenya'))
      if (kenyaEntry) {
        options = [kenyaEntry[1]]
      }
    }

    return {
      countryCodeOptions: options,
      selectedCode: options[0] || '',
      phoneNumber: '',
      isSubmitting: false,
      successMessage: ''
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
      if (!this.selectedCode) return ''
      const match = this.selectedCode.match(/(\+\d+)/)
      return match ? match[1] : ''
    }
  },
  methods: {
    async initiateMpesa() {
      if (!this.canContinue || this.isSubmitting) return
      this.isSubmitting = true
      this.successMessage = ''
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
        if (response?.success) {
          this.successMessage = 'Please continue to your M‑Pesa wallet to confirm the transaction.'
        }
        this.$toast?.({
          title: 'M‑Pesa initiated',
          description: 'Follow the instructions in your M‑Pesa app to complete the payment.'
        })
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
