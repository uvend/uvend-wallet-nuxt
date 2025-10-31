<template>
    <div class="grid grid-cols-2 gap-4">
        <!-- Total Spent KPI -->
        <Card class="group relative overflow-hidden bg-gradient-to-br from-white to-red-50/30 border border-red-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-300">
                            <Icon name="lucide:trending-down" class="h-4 w-4 text-red-600"/>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Spent</p>
                        </div>
                    </div>
                    <div class="w-2 h-2 rounded-full bg-red-500 shadow-sm"></div>
                </div>
                <div class="space-y-1">
                    <Skeleton class="w-24 h-8" v-if="isLoading"/>
                    <p class="text-2xl font-bold text-red-700" v-else>{{ formatAmount(totalSpent) }}</p>
                    <div class="flex items-center gap-1">
                        <div class="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                        <p class="text-xs text-gray-600">Expenses</p>
                    </div>
                </div>
            </div>
            <!-- Subtle gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-100/20 pointer-events-none"></div>
        </Card>

        <!-- Total Deposited KPI -->
        <Card class="group relative overflow-hidden bg-gradient-to-br from-white to-green-50/30 border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                            <Icon name="lucide:trending-up" class="h-4 w-4 text-green-600"/>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Purchases Made</p>
                        </div>
                    </div>
                    <div class="w-2 h-2 rounded-full bg-green-500 shadow-sm"></div>
                </div>
                <div class="space-y-1">
                    <Skeleton class="w-24 h-8" v-if="isLoading"/>
                    <p class="text-2xl font-bold text-green-700" v-else>{{ totalPurchases }}</p>
                    <div class="flex items-center gap-1">
                        <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                        <p class="text-xs text-gray-600">Purchases</p>
                    </div>
                </div>
            </div>
            <!-- Subtle gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-100/20 pointer-events-none"></div>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const totalSpent = ref(0)
const totalPurchases = ref(0)
const totalDeposited = ref(0)
const isLoading = ref(true)

function formatAmount(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: amount > 999999 ? 'compact' : 'standard'
    }).format(amount)
}

async function fetchKpiData() {
    isLoading.value = true
    try {
        // Fetch transactions data to get total amounts
        const transactionsResponse = await useWalletAuthFetch(`${WALLET_API_URL}/meter/token/history`)
        
        // Use the totalAmount from the response instead of calculating
        totalSpent.value = parseFloat(transactionsResponse.totalAmount || 0)
        totalPurchases.value = transactionsResponse.totalCount ||0


        // For now, we'll use wallet balance as deposited amount
        // In a real scenario, you'd have separate deposit transactions
        const balanceResponse = await useWalletAuthFetch(`${WALLET_API_URL}/pay/balance`)
        totalDeposited.value = parseFloat(balanceResponse.balance)

    } catch (error) {
        console.error('Error fetching KPI data:', error)
        useToast({
            title: 'Error',
            description: 'Failed to load KPI data',
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchKpiData()
})
</script>
