<template>
    <div :class="stack ? 'flex flex-col h-full gap-4' : 'grid grid-cols-2 gap-3 items-stretch h-full'">
        <!-- Total Spent KPI (match payments style) -->
        <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl h-full">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:coins" class="w-4 h-4 text-blue-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Total Spent</span>
                </div>
                    <Skeleton class="w-24 h-8" v-if="isLoading"/>
                <p v-else class="text-2xl font-bold text-gray-900">{{ $currency(totalSpent) }}</p>
                <p class="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
        </Card>

        <!-- Total Purchase KPI (match payments style) -->
        <Card class="bg-white/95 backdrop-blur-sm border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl h-full">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:trending-up" class="w-4 h-4 text-purple-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Total Purchase</span>
                </div>
                    <Skeleton class="w-24 h-8" v-if="isLoading"/>
                <p v-else class="text-2xl font-bold text-gray-900">{{ totalPurchases }}</p>
                <p class="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({ stack: { type: Boolean, default: false } })

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
        const transactionsResponse = await useWalletAuthFetch(`/meter/token/history`)
        
        // Use the totalAmount from the response instead of calculating
        totalSpent.value = parseFloat(transactionsResponse.totalAmount || 0)
        totalPurchases.value = transactionsResponse.totalCount ||0


        // For now, we'll use wallet balance as deposited amount
        // In a real scenario, you'd have separate deposit transactions
        const balanceResponse = await useWalletAuthFetch(`/pay/balance`)
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
