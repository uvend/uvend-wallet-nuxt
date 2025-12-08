<template>
<div class="flex flex-col p-4 gap-6">
    <!-- Wallet Card -->
    <WalletDebitCard />

    <!-- Summary Statistics -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Deposits -->
        <Card class="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:wallet" class="w-4 h-4 text-orange-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Total Deposits</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">R {{ totalDeposits }}</p>
                <p class="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
        </Card>

        <!-- Successful Payments -->
        <!-- <Card class="bg-white/95 backdrop-blur-sm border border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:check-circle" class="w-4 h-4 text-green-600" />
        </div>
                    <span class="text-xs font-medium text-gray-600">Successful</span>
                </div>
                <p class="text-2xl font-bold text-green-600">{{ successfulCount }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ successRate }}% success rate</p>
            </CardContent>
            </Card> -->
            
        <!-- Failed Payments -->
        <!-- <Card class="bg-white/95 backdrop-blur-sm border border-red-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:x-circle" class="w-4 h-4 text-red-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Failed</span>
                </div>
                <p class="text-2xl font-bold text-red-600">{{ failedCount }}</p>
                <p class="text-xs text-gray-500 mt-1">R {{ failedAmount }}</p>
            </CardContent>
        </Card> -->

        <!-- Average Deposit -->
        <Card class="bg-white/95 backdrop-blur-sm border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:trending-up" class="w-4 h-4 text-purple-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Average</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">R {{ averageDeposit }}</p>
                <p class="text-xs text-gray-500 mt-1">Per deposit</p>
            </CardContent>
            </Card>
        </div>

    <!-- Deposit Trends Chart -->
    <WalletBalanceHistoryChart :transactions="fundingHistory" :isLoading="isLoading" />

    <!-- Payments Table -->
    <Card class="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader>
            <CardTitle class="text-lg font-semibold text-gray-800">Payment History</CardTitle>
            <CardDescription class="text-sm">{{ fundingHistory.length }} payments found</CardDescription>
        </CardHeader>
        <CardContent class="p-0">
            <div v-if="isLoading" class="py-8 flex justify-center">
                <MyLoader />
            </div>
            <div v-else-if="fundingHistory.length > 0">
                <!-- Desktop Table - Scrollable -->
                <div class="hidden md:block overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                        <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            <table class="min-w-[900px] w-full">
                                <thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700 w-[150px]">Date & Time</th>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700 w-[200px]">Reference</th>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700 w-[150px]">Method</th>
                                        <th class="text-right py-3 px-4 text-xs font-semibold text-gray-700 w-[120px]">Amount</th>
                                        <th class="text-center py-3 px-4 text-xs font-semibold text-gray-700 w-[100px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100 bg-white">
                                    <tr v-for="payment in fundingHistory" 
                                        :key="payment.id"
                                        class="hover:bg-orange-50/50 transition-colors duration-200"
                                    >
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <p class="text-sm font-medium text-gray-900">{{ formatDate(payment.created) }}</p>
                                            <p class="text-xs text-gray-500">{{ formatTime(payment.created) }}</p>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <p class="text-sm text-gray-600 font-mono">{{ payment.reference || 'N/A' }}</p>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <div class="flex items-center gap-2">
                                                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Icon name="lucide:credit-card" class="w-4 h-4 text-orange-600" />
                                                </div>
                                                <span class="text-sm font-medium text-gray-900">Card</span>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-right whitespace-nowrap">
                                            <p class="text-sm font-semibold text-orange-600">
                                                R {{ formatAmount(payment.amount) }}
                                            </p>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">
                                            <span 
                                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                                                :class="getStatusClass(payment.result_desc)"
                                            >
                                                {{ getStatusText(payment.result_desc) }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Mobile Cards -->
                <div class="md:hidden divide-y divide-gray-100">
                    <div v-for="payment in fundingHistory" 
                         :key="payment.id"
                         class="p-4"
                    >
                        <!-- Collapsed View -->
                        <div 
                            class="flex items-center justify-between cursor-pointer"
                            @click="toggleExpand(payment.id)"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-100">
                                    <Icon name="lucide:credit-card" class="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">Deposit</p>
                                    <p class="text-xs text-gray-500">{{ formatDate(payment.created) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <p class="text-sm font-bold text-orange-600">
                                    R {{ formatAmount(payment.amount) }}
                                </p>
                                <Icon 
                                    :name="expandedRows.includes(payment.id) ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                                    class="w-5 h-5 text-gray-400"
                                />
            </div>
      </div>
    
                        <!-- Expanded View -->
                        <div v-if="expandedRows.includes(payment.id)" class="mt-4 space-y-3 bg-gray-50 p-3 rounded-lg">
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Reference</span>
                                <span class="text-xs font-medium text-gray-900 font-mono">{{ payment.payvault_data_1 || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Time</span>
                                <span class="text-xs font-medium text-gray-900">{{ formatTime(payment.created) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Method</span>
                                <span class="text-xs font-medium text-gray-900">Card Payment</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Status</span>
                                <span 
                                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                    :class="getStatusClass(payment.result_desc)"
                                >
                                    {{ getStatusText(payment.result_desc) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="lucide:wallet" class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-gray-600 font-medium">No payments found</p>
                <p class="text-gray-400 text-sm mt-1">Payments will appear here when deposits are made</p>
            </div>
        </CardContent>
    </Card>
</div>
  </template>

<script>
definePageMeta({
    layout: 'wallet'
})

export default {
  data() {
    return {
      isLoading: false,
      fundingHistory: [],
      expandedRows: []
    }
  },
  methods: {
    async fetchData() {
        this.isLoading = true;
        try {
          const response = await useWalletAuthFetch(`/pay/history`)
          this.fundingHistory = response.payments.reverse();
        } catch (error) {
          console.error('Error fetching payments:', error);
          this.$toast({
            title: 'Error',
            description: 'Failed to load payments',
            variant: 'destructive'
          });
        } finally {
          this.isLoading = false;
        }
      },
    
    formatAmount(amount) {
        return (parseFloat(amount) / 100).toFixed(2);
    },

    formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    },

    formatTime(dateString) {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-ZA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    },

    getStatusClass(status) {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'auth done') {
            return 'bg-green-100 text-green-700';
        }
        return 'bg-red-100 text-red-700';
    },

    getStatusText(status) {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'auth done') {
            return 'Successful';
        }
        return status || 'Failed';
    },

    toggleExpand(paymentId) {
        const index = this.expandedRows.indexOf(paymentId)
        if (index > -1) {
            this.expandedRows.splice(index, 1)
        } else {
            this.expandedRows.push(paymentId)
        }
    }
  },
  
  mounted() {
    // Uncomment below to fetch real data
    this.fetchData()
  },
  
  computed: {
    totalDeposits() {
        return this.fundingHistory.reduce((sum, p) => sum + parseFloat(p.amount), 0) / 100;
    },

    successfulPayments() {
        return this.fundingHistory.filter(p => p.result_desc?.toLowerCase() === 'auth done');
    },

    failedPayments() {
        return this.fundingHistory.filter(p => p.result_desc?.toLowerCase() !== 'auth done');
    },

    successfulCount() {
        return this.successfulPayments.length;
    },

    failedCount() {
        return this.failedPayments.length;
    },

    successRate() {
        if (this.fundingHistory.length === 0) return 0;
        return ((this.successfulCount / this.fundingHistory.length) * 100).toFixed(1);
    },

    failedAmount() {
        return (this.failedPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0) / 100).toFixed(2);
    },

    averageDeposit() {
        if (this.successfulPayments.length === 0) return '0.00';
        const total = this.successfulPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        return (total / this.successfulPayments.length / 100).toFixed(2);
    },

    
  }
}
</script>

<style scoped>
/* Custom scrollbar for payment table */
.scrollbar-thin::-webkit-scrollbar {
    height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    transition: background 0.2s ease;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Firefox scrollbar */
.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}
</style>