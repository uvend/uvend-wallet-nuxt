<template>
    <div class="w-full">
        <div 
            class="group relative overflow-hidden rounded-2xl p-4 md:p-6 shadow-xl text-white transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]"
            :style="{ background: cardBackground }"
        >
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <!-- top row -->
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-white/90 shadow-sm"></div>
                    <p class="text-base font-bold tracking-wide">Uvend Prepaid Utilities</p>
                </div>
                <div class="h-8 w-12 rounded-lg bg-gradient-to-br from-yellow-300 to-amber-500 shadow-inner flex items-center justify-center">
                    <div class="w-6 h-4 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-md shadow-inner"></div>
                </div>
            </div>

            <!-- balance section -->
            <div class="mb-6">
                <p class="text-xs text-white/90 mb-1 font-medium">Available balance</p>
                <Skeleton v-if="isWalletLoading" class="w-40 h-8 md:h-10 rounded bg-white/30" />
                <p v-else class="text-3xl md:text-4xl font-black tracking-tight">{{ formattedBalance }}</p>
                <div class="mt-2 flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                    <p class="text-xs text-white/80">Active account</p>
                </div>
            </div>

            <!-- account + action -->
            <div class="flex items-center justify-between">
                <div class="space-y-1">
                    <p class="text-xs text-white/90 font-medium">Account</p>
                    <Skeleton v-if="isWalletLoading" class="w-48 h-4 rounded bg-white/30" />
                    <p v-else class="text-sm tracking-widest font-bold">{{ maskedAccount }}</p>
                </div>
                <div class="flex flex-col items-end gap-1">
                    <!-- Loading state - skeleton only while wallet is loading -->
                    <Skeleton v-if="isWalletLoading" class="h-9 w-28 rounded-xl bg-white/30" />
                    <!-- Top up button - shown when meters exist -->
                    <button 
                        v-else-if="hasMeters || metersLoading"
                        class="group/btn relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-white/95 text-blue-700 hover:bg-white transition-all duration-300 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg"
                        @click="handleTopUp"
                        title="Top up your wallet"
                    >
                        <Icon name="lucide:wallet" class="w-3 h-3 mr-1.5 relative z-10"/>
                        <span class="relative z-10">Top up</span>
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    <!-- Add meter button - shown when no meters exist (and loaded) -->
                    <button 
                        v-else
                        class="group/btn relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-white/95 text-blue-700 hover:bg-white transition-all duration-300 px-4 py-2 text-xs font-bold shadow-md hover:shadow-lg"
                        @click="navigateToTransactions"
                        title="Add a meter to get started"
                    >
                        <Icon name="lucide:plus-circle" class="w-3 h-3 mr-1.5 relative z-10"/>
                        <span class="relative z-10">Add Meter</span>
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>
            </div>

            <!-- Enhanced decorative elements -->
            <div class="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
            <div class="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5 blur-2xl"></div>
        </div>

        <!-- Top Up Dialog/Popup -->
        <WalletPopup 
            v-model="showTopUpDialog" 
            buttonLabel="Top Up Wallet"
            :hasButton="false"
        >
            <div class="flex flex-col gap-6 overflow-y-auto hide-scrollbar">
                <!-- PayGate iframe for payment processing -->
                <div v-if="currentTab === 'paygate'" class="space-y-4">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Icon name="lucide:shield-check" class="h-8 w-8 text-blue-600"/>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-1">Secure Payment</h4>
                        <p class="text-sm text-gray-600">Processing your payment securely</p>
                    </div>
                    <WalletPayGate 
                        :pay_request_id="payRequestId" 
                        :checksum="checksum" 
                        @payment-complete="paymentComplete"
                    />
                </div>
                <!-- Payment form -->
                <div v-if="currentTab === 'payment'" class="space-y-6">
                    <!-- Current Balance Display -->
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                    <Icon name="lucide:wallet" class="h-5 w-5 text-white"/>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-600">Current Balance</p>
                                    <p class="text-xl font-bold text-blue-700">{{ formattedBalance }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Amount Input -->
                    <div class="space-y-4">
                        <div>
                            <Label for="amount" class="text-sm font-semibold text-gray-700 mb-2 block">
                                <Icon name="lucide:dollar-sign" class="h-4 w-4 inline mr-2"/>
                                Amount to Add
                            </Label>
                            <NumberField 
                                id="amount" 
                                :min="0" 
                                v-model="amount" 
                                :format-options="{
                                    minimumFractionDigits: 2,
                                }"
                            >
                                <NumberFieldContent class="bg-white border-2 border-gray-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                                    <NumberFieldInput class="text-lg font-semibold py-4 px-4"/>
                                </NumberFieldContent>
                            </NumberField>
                        </div>
                        
                        <!-- Quick Amount Buttons -->
                        <div class="grid grid-cols-3 gap-3">
                            <Button 
                                v-for="quickAmount in [100, 500, 1000]" 
                                :key="quickAmount"
                                variant="outline" 
                                @click="amount = quickAmount"
                                class="py-2 px-3 text-sm font-medium border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            >
                                {{ currency }} {{ quickAmount }}
                            </Button>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">
                                Pay with
                            </p>
                        </div>
                        <div v-if="isLoading">
                            <p><NuxtLoadingIndicator /></p>
                        </div>
                        <div v-else class="flex flex-col gap-2">
                            <Button 
                                class="w-full py-4 text-lg font-semibold font-scandia bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                                @click="addPayAtFunds" 
                                :disabled="amount < 30"
                            >
                                <span class="font-scandia">pay@</span>
                            </Button>
                        <Button 
                                class="w-full py-4 text-lg font-semibold font-scandia bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                            @click="addFunds" 
                                :disabled="amount < 30"
                        >
                                <span class="font-scandia">paygate</span>
                        </Button>
                        </div>
                    </div>
                    
                    <!-- Payment Methods Info -->
                    <div class="bg-gray-50 rounded-xl p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <Icon name="lucide:shield" class="h-5 w-5 text-green-600"/>
                            <h5 class="font-semibold text-gray-900">Secure Payment</h5>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">Your payment is processed securely through our trusted payment gateway.</p>
                        <div class="flex items-center gap-4 text-xs text-gray-500">
                            <div class="flex items-center gap-1">
                                <Icon name="lucide:lock" class="h-3 w-3"/>
                                <span>SSL Encrypted</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <Icon name="lucide:credit-card" class="h-3 w-3"/>
                                <span>All Cards Accepted</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Saved cards section (commented out as in original) -->
                    <div v-if="cards.length > 0" class="hidden">
                        <!-- Cards UI would go here when payvault is enabled -->
                    </div>
                </div>
                
                <!-- Cards management -->
                <div v-if="currentTab === 'cards'" class="space-y-4">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Icon name="lucide:credit-card" class="h-8 w-8 text-purple-600"/>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-1">Manage Cards</h4>
                        <p class="text-sm text-gray-600">Add or manage your payment methods</p>
                    </div>
                    
                    <WalletBankCards />
                    
                    <div class="flex gap-3 pt-4">
                        <Button 
                            @click="addCard" 
                            class="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl"
                        >
                            <Icon name="lucide:plus" class="h-4 w-4 mr-2"/>
                            Add New Card
                        </Button>
                        <Button 
                            @click="currentTab = 'payment'" 
                            variant="outline" 
                            class="flex-1 border-gray-300 hover:bg-gray-50 rounded-xl"
                        >
                            <Icon name="lucide:arrow-left" class="h-4 w-4 mr-2"/>
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </WalletPopup>
    </div>
</template>

<script>
export default {
    name: 'WalletDebitCard',
    props: {
        balance: { type: Number, default: 0 },
        currency: { type: String, default: 'R' },
        // accountLast4: { type: String, default: '3456' },
        bgPrimary: { type: String, default: () => `#${APP_BG_2?.replace('#','') || '1287c9'}` },
        bgSecondary: { type: String, default: () => '#3b5bdb' }
    },
    data() {
        return {
            showTopUpDialog: false,
            currentTab: 'payment',
            amount: 0.00,
            payRequestId: null,
            checksum: null,
                payAtUrl: null,
            cards: [],
            selectedCard: null,
            isLoading: false,
            actualBalance: 0,
            accountNumber:null,
            isWalletLoading: true
        }
    },
    computed: {
        cardBackground(){
            return `linear-gradient(135deg, ${this.bgPrimary} 0%, ${this.bgSecondary} 70%)`;
        },
        formattedBalance(){
                const displayBalance = this.actualBalance || this.balance;
            const { $currency } = useNuxtApp()
            return $currency ? $currency(displayBalance) : `R ${Number(displayBalance || 0).toFixed(2)}`
        },
        maskedAccount(){
            return `${this.accountNumber}`
        },
        hasMeters() {
            const metersStore = useMetersStore();
            // Only return true if meters are loaded AND we have meters
            return metersStore.isLoaded && metersStore.meters && metersStore.meters.length > 0;
        },
        metersLoading() {
            const metersStore = useMetersStore();
            // Show loading if we haven't loaded yet or are currently loading
            return !metersStore.isLoaded || metersStore.isLoading;
        }
    },
    methods: {
        handleTopUp(){
            this.showTopUpDialog = true;
            this.currentTab = 'payment';
            this.amount = 0.00;
            this.getCards();
        },
        navigateToTransactions(){
            this.$router.push('/transactions');
        },
        async addCard(){
            try {
                const response = await useWalletAuthFetch(`/pay/addCard`)
                this.payRequestId = response.PAY_REQUEST_ID
                this.checksum = response.CHECKSUM
                this.currentTab = 'paygate'
            } catch(error) {
                console.error('Error adding card:', error)
            }
        },
        async getCards(primary = false){
            try {
                const response = await useWalletAuthFetch(`/pay/card`,{
                    params: {
                        primary: primary
                    }
                })
                this.cards = response || [];
                this.cards.forEach(card => {
                    if(card.primary){
                        // this.selectedCard = card
                    }
                });
            } catch(error) {
                console.error('Error fetching cards:', error)
                this.cards = [];
            }
        },
        selectCard(id){
            console.log(id)
            this.selectedCard = id;
        },
        async addFunds(){
            this.isLoading = true;
            if(!this.selectedCard && this.amount < 1) return;
            try{
                let url = `/pay/addFunds`;
                if(this.selectedCard){
                    url = `${url}/${this.selectedCard}`
                }
                const response = await useWalletAuthFetch(url,{
                    method: "POST",
                    body: {
                        amount: this.amount
                    }
                })
                console.log(response)
                this.payRequestId = response.PAY_REQUEST_ID
                this.checksum = response.CHECKSUM
                this.currentTab = "paygate"
            }catch(error){
                console.error('Error adding funds:', error)
            } finally {
                this.isLoading = false;
            }
        },
        async addPayAtFunds(){
            console.log("addPayAtFunds")
            try{
                // @Todo: disable button to prevent clicks while waitinf for response
                const response = await useWalletAuthFetch(`/payat/request`, {
                method: "POST",
                body: {
                    amount: this.amount
                    }
                })
                // Expecting response.payAtUrl
                console.log(response)
                this.payAtUrl = response?.payAtUrl || null
                if (this.payAtUrl) {
                    // Open Pay@ in a new tab and close the popup
                    window.open(this.payAtUrl, '_blank', 'noopener,noreferrer')
                    this.showTopUpDialog = false
                }
            }catch(error){
                console.error('Error adding payat funds:', error)
            }
        },
        async getWalletBalance(){
            try {
                this.isWalletLoading = true
                const response = await useWalletAuthFetch(`/pay/balance`)
                this.actualBalance = Number(response.balance);
                this.accountNumber = response.account
                this.$emit('balance-updated', this.actualBalance);
            } catch(error) {
                console.error('Error fetching wallet balance:', error)
            } finally {
                this.isWalletLoading = false
            }
        },
        paymentComplete(){
            this.amount = 0.00
            this.currentTab = 'payment'
            this.showTopUpDialog = false
            // Refresh the balance after successful payment
            this.getWalletBalance()
        }
    },
    mounted() {
        // Fetch initial balance
        this.getWalletBalance();
    }
}
</script>

<style scoped>
/* Ensure the card looks great on mobile */
</style>
