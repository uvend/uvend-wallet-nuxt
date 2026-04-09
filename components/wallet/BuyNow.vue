<template>
  <div class="relative min-h-[200px]">
    <!-- Loading overlay only while vending -->
    <div v-if="vending" class="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex items-center justify-center">
      <div class="flex items-center gap-3 text-blue-700">
        <Icon name="lucide:loader-2" class="h-6 w-6 animate-spin" />
        <span class="text-sm font-medium">Processing purchase…</span>
      </div>
    </div>
    <div class="p-4 space-y-4" v-if="!vendResponse">
      <WalletCardBalance :addMoney="false"/>
      <div v-if="meters.length > 0" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon name="lucide:zap" class="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <p class="text-sm font-semibold text-blue-900">Buy utility token</p>
            <p class="text-xs text-blue-700">Select a meter and enter how much you want to purchase.</p>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="meter" class="text-xs font-semibold text-gray-700">Meter</Label>
          <Select v-model="value">
            <SelectTrigger class="bg-white border-gray-200">
              <SelectValue placeholder="Select a meter" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem v-for="meter in meters" :value="meter">
                  {{ meter.name }} ({{ meter.meterNumber }})
                </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <NumberField id="age" :min="0" v-model="amount" :format-options="{
                  minimumFractionDigits: 2,
                  }">
          <Label for="age" class="text-xs font-semibold text-gray-700">Amount</Label>
          <NumberFieldContent class="bg-white border border-gray-200 rounded-md">
            <NumberFieldInput class="font-semibold" />
          </NumberFieldContent>
        </NumberField>

        <div class="grid grid-cols-3 gap-2">
          <Button variant="outline" class="text-xs" @click="amount = 30">30</Button>
          <Button variant="outline" class="text-xs" @click="amount = 100">100</Button>
          <Button variant="outline" class="text-xs" @click="amount = 500">500</Button>
        </div>

        <Button
          class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          @click="creditToken(false)"
          :disabled="vending || !value || amount <= 0"
        >
          <Icon name="lucide:shopping-cart" class="w-4 h-4 mr-2" />
          Purchase Tokens
        </Button>
      </div>
      <div v-if="!isLoading && meters.length == 0">
          <!-- navigate to add a meter -->
           <p class="mb-2 text-sm text-gray-700">
            Oops, you do not have any meters loaded.
           </p>
            <DialogClose as-child>
              <Button @click="navigateTo('/meters')" type="submit">Go to meters <Icon name="lucide:arrow-right"/> </Button>
            </DialogClose>
      </div>
    </div>
    <div v-else class="p-4 space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <Icon name="lucide:check-circle-2" class="w-5 h-5 text-green-700" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-green-800">Token purchase successful</p>
          <p class="text-xs text-green-700">Your token is ready to use and can be copied or shared.</p>
        </div>
      </div>

      <div v-if="isKeyChangeOnNextVend" class="rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p class="text-xs font-semibold text-amber-800">Meter State</p>
        <p class="text-sm font-medium text-amber-900">KEY CHANGE ON NEXT VEND</p>
      </div>

      <div class="space-y-2">
        <p class="text-xs text-gray-600 font-medium">
          {{ isKeyChangeOnNextVend ? 'Issued Tokens' : 'Purchased Token' }}
        </p>
        <div class="rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 break-words space-y-2">
          <template v-if="displayTokens.length > 0">
            <p
              v-for="(token, index) in displayTokens"
              :key="`${token.label}-${token.value}-${index}`"
              class="font-mono"
            >
              <span class="font-semibold text-gray-700">{{ token.label }}:</span>
              {{ token.value }}
            </p>
          </template>
          <p v-else class="font-mono">{{ purchasedTokenText }}</p>
        </div>
      </div>

      <div v-if="purchasedUnitsText" class="rounded-xl border border-blue-200 bg-blue-50 p-3">
        <p class="text-xs font-semibold text-blue-800">Utility Amount</p>
        <p class="text-sm font-medium text-blue-900">{{ purchasedUnitsText }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button variant="outline" class="w-full" @click="copyToken">
          <Icon name="lucide:copy" class="w-4 h-4 mr-2" />
          Copy Token
        </Button>
        <Button variant="outline" class="w-full" @click="shareToken">
          <Icon name="lucide:share-2" class="w-4 h-4 mr-2" />
          Share Token
        </Button>
        <Button class="w-full" @click="resetPurchase">
          Buy Another
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    selectedMeter: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      meters: [],
      isLoading: false,
      value: null,
      amount: 30,
      vendResponse: null,
      vending: false
    }
  },
  methods: {
    getDisplayTokens() {
      const tokenTransactions = this.vendResponse?.listOfTokenTransactions?.[0]
      const tokens = Array.isArray(tokenTransactions?.tokens) ? tokenTransactions.tokens : []
      const tokenCount = Number(tokenTransactions?.tokenCount || tokens.length || 0)

      if (!tokenCount) return []

      if (tokenCount <= 1) {
        const token = tokens[0] || {}
        const tokenValue =
          (Array.isArray(token.tokenKeys) && token.tokenKeys.length > 0 && token.tokenKeys.join(' ')) ||
          token.delimitedTokenNumber ||
          token.tokenNumber ||
          ''
        return tokenValue ? [{ label: 'Credit token', value: tokenValue }] : []
      }

      return tokens
        .map((token, index) => {
          const tokenValue =
            (Array.isArray(token.tokenKeys) && token.tokenKeys.length > 0 && token.tokenKeys.join(' ')) ||
            token.delimitedTokenNumber ||
            token.tokenNumber ||
            ''
          if (!tokenValue) return null

          let label = `${index + 1}thDecoderKey`
          if (index === 0) label = '1stDecoderKey'
          if (index === 1) label = '2ndDecoderKey'
          if (index === tokens.length - 1) label = 'Credit token'

          return { label, value: tokenValue }
        })
        .filter(Boolean)
    },

    extractTokenText() {
      const text = []
      const tx = this.vendResponse?.listOfTokenTransactions || []
      tx.forEach((item) => {
        (item.tokens || []).forEach((token) => {
          if (Array.isArray(token.tokenKeys) && token.tokenKeys.length > 0) {
            text.push(token.tokenKeys.join(' '))
          } else if (token.delimitedTokenNumber) {
            text.push(token.delimitedTokenNumber)
          } else if (token.tokenNumber) {
            text.push(token.tokenNumber)
          }
        })
      })
      return text.join('\n')
    },
    async copyToken() {
      const tokenText = this.extractTokenText()
      if (!tokenText) return
      try {
        await navigator.clipboard.writeText(tokenText)
        this.$toast({
          title: 'Copied',
          description: 'Token copied to clipboard.',
        })
      } catch (error) {
        console.error('Failed to copy token:', error)
        this.$toast({
          title: 'Copy failed',
          description: 'Unable to copy token. Please copy it manually.',
          variant: 'destructive'
        })
      }
    },
    async shareToken() {
      const tokenText = this.extractTokenText()
      if (!tokenText) return
      try {
        if (navigator.share) {
          await navigator.share({
            title: 'Uvend Token',
            text: tokenText
          })
        } else {
          await this.copyToken()
          this.$toast({
            title: 'Share not available',
            description: 'Token copied instead. You can now paste and share it.'
          })
        }
      } catch (error) {
        console.error('Failed to share token:', error)
      }
    },
    resetPurchase() {
      this.vendResponse = null
    },
    async fetchMeters() {
      this.isLoading = true;
      try {
        const response = await useWalletAuthFetch(`/meter`)
        this.meters = response.meters; // Will be populated by API in the future
      } catch (error) {
        console.error('Error fetching meters:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to load meters',
          variant: 'destructive'
        });
      } finally {
        this.isLoading = false;
      }
    },
    async creditToken(preview) {
      this.vending = true;
      try {
        const id = this.value?.id ?? null
        const response = await useWalletAuthFetch(`/meter/token/${id}`, {
          method: 'POST',
          body: {
            amount: this.amount,
            preview: preview
          }
        });

        if (!response.balance) {
          throw new Error('An unknown error occurred');
        }

        this.vendResponse = response.token;
        this.$store.balance = response.balance
        // TODO: emit success to reload parent
      } catch (error) {
        console.error('Error fetching vend response:', error);
        const backendMessage =
          error?.error?.message ||
          error?.response?._data?.error?.message ||
          error?.response?._data?.message ||
          error?.message;

        this.$toast({
          title: 'Error',
          description: backendMessage || 'Unable to process token purchase. Please try again.',
          variant: 'destructive'
        });
      } finally{
        this.vending = false;
      }
    },
  },
  computed: {
    purchasedUnitsText() {
      const tokenTransactions = this.vendResponse?.listOfTokenTransactions?.[0]
      const tokens = Array.isArray(tokenTransactions?.tokens) ? tokenTransactions.tokens : []
      if (tokens.length === 0) return ''

      const tokenCount = Number(tokenTransactions?.tokenCount || tokens.length || 0)
      const creditToken = tokenCount > 1 ? tokens[tokens.length - 1] : tokens[0]
      if (!creditToken) return ''

      const units = creditToken.units
      if (units === null || units === undefined || units === '') return ''

      const unitName = creditToken.unitName || 'units'
      return `${units} ${unitName}`
    },
    displayTokens() {
      return this.getDisplayTokens()
    },
    isKeyChangeOnNextVend() {
      const tokenTransactions = this.vendResponse?.listOfTokenTransactions?.[0]
      const tokenCount = Number(tokenTransactions?.tokenCount || tokenTransactions?.tokens?.length || 0)
      return tokenCount > 1
    },
    purchasedTokenText() {
      return this.extractTokenText() || 'No token available'
    }
  },
  watch: {
    selectedMeter: {
      handler(newMeter) {
        if (newMeter) {
          this.value = newMeter;
        }
      },
      immediate: true
    }
  },
  async mounted() {
    await this.fetchMeters()
  }
}
</script>
<style>
</style>