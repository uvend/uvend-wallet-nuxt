<template>
  <div>
    <div class="p-4 flex flex-col gap-2" v-if="!vendResponse">
      <WalletCardBalance :addMoney="false"/>
      <div v-if="meters.length > 0" class="flex flex-col gap-2">
        <Label for="meter">Meter</Label>
        <Select v-model="value">
          <SelectTrigger>
            <SelectValue placeholder="Select a meter" />
          </SelectTrigger>
          <SelectContent>
              <SelectItem v-for="meter in meters" :value="meter">
                {{ meter.name }} ({{ meter.meterNumber }})
              </SelectItem>
          </SelectContent>
        </Select>
        <NumberField id="age" :min="0" v-model="amount" :format-options="{
                  minimumFractionDigits: 2,
                  }">
          <Label for="age">Amount</Label>
          <NumberFieldContent>
            <NumberFieldInput />
          </NumberFieldContent>
        </NumberField>
        <Button @click="creditToken(false)" :disabled="vending">Purchase Tokens</Button>
      </div>
      <div v-if="!isLoading && meters.length == 0">
          <!-- navigate to add a meter -->
           <p class="mb-2">
            Oops, you do not have any meters loaded.
           </p>
            <DialogClose as-child>
              <Button @click="navigateTo('/meters')" type="submit">Go to meters <Icon name="lucide:arrow-right"/> </Button>
            </DialogClose>
      </div>
    </div>
    <div v-else class="p-2 h-full flex items-center justify-center text-xl">
      <p v-for="token in vendResponse.listOfTokenTransactions">
            <div v-for="tokens in token.tokens">
                <span v-for="keys in tokens.tokenKeys">
                    <span>{{ keys }} &nbsp;</span>
                </span>
            </div>
        </p>
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
    async fetchMeters() {
      this.isLoading = true;
      try {
        const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter`)
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
        const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/token/${id}`, {
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
        this.$toast({
          title: 'Error',
          description: 'Invalid meter number entered',
          variant: 'destructive'
        });
      } finally{
        this.vending = false;
      }
    },
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