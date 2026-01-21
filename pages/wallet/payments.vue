<template>
<div class="flex flex-col p-4 gap-6">
    <!-- Top grid: Debit card (left) and summary cards (right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- Left column: Debit Card -->
        <div class="lg:col-span-6">
    <WalletDebitCard />
        </div>
        <!-- Right column: Summary cards (2x2 grid) -->
        <div class="grid grid-cols-2 gap-3 items-stretch lg:col-span-6">
        <!-- Total Deposits -->
        <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:wallet" class="w-4 h-4 text-blue-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Total Deposits</span>
                </div>
                <Skeleton v-if="isLoading" class="w-24 h-8" />
                <p v-else class="text-2xl font-bold text-gray-900">{{ formatZar(totalDeposits) }}</p>
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
                <Skeleton v-if="isLoading" class="w-24 h-8" />
                <p v-else class="text-2xl font-bold text-gray-900">{{ formatZar(averageDeposit) }}</p>
                <p class="text-xs text-gray-500 mt-1">Per deposit</p>
            </CardContent>
            </Card>
        </div>
        </div>

    <!-- Deposit Trends Chart -->
    <!-- <WalletBalanceHistoryChart :transactions="fundingHistory" :isLoading="isLoading" /> -->

    <!-- Payments Table -->
    <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader>
            <CardTitle class="text-lg font-semibold text-gray-800">Payment History</CardTitle>
            <CardDescription class="text-sm">
                <template v-if="isLoading">
                    <Skeleton class="w-32 h-4" />
                </template>
                <template v-else>
                    {{ totalCount }} payments found
                </template>
            </CardDescription>
        </CardHeader>
        <CardContent class="p-0">
            <div v-if="isLoading" class="p-6 space-y-4">
                <!-- Desktop-like skeleton header -->
                <div class="hidden md:block">
                    <div class="bg-gray-50 border-b border-gray-200 p-3 rounded-t-xl">
                        <div class="grid grid-cols-5 gap-3">
                            <Skeleton class="h-4 w-28" />
                            <Skeleton class="h-4 w-32" />
                            <Skeleton class="h-4 w-24" />
                            <Skeleton class="h-4 w-20 justify-self-end" />
                            <Skeleton class="h-4 w-16 justify-self-center" />
                        </div>
                    </div>
                    <div class="divide-y">
                        <div v-for="i in 6" :key="'pay-row-'+i" class="grid grid-cols-5 gap-3 p-3 items-center">
                            <div class="space-y-1">
                                <Skeleton class="h-4 w-32" />
                                <Skeleton class="h-3 w-20" />
                            </div>
                            <Skeleton class="h-4 w-40" />
                            <div class="flex items-center gap-2">
                                <Skeleton class="w-8 h-8 rounded-lg" />
                                <Skeleton class="h-4 w-20" />
                            </div>
                            <div class="justify-self-end">
                                <Skeleton class="h-4 w-20" />
                            </div>
                            <div class="justify-self-center">
                                <Skeleton class="h-6 w-20 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Mobile card-like skeletons -->
                <div class="md:hidden space-y-3">
                    <div v-for="i in 4" :key="'pay-m-'+i" class="p-4 border rounded-lg bg-white">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <Skeleton class="w-10 h-10 rounded-lg" />
                                <div class="space-y-2">
                                    <Skeleton class="w-24 h-4" />
                                    <Skeleton class="w-20 h-3" />
                                </div>
                            </div>
                            <div class="text-right space-y-2">
                                <Skeleton class="w-20 h-4" />
                                <Skeleton class="w-16 h-3" />
                            </div>
                        </div>
                    </div>
                </div>
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
                                        class="hover:bg-blue-50/50 transition-colors duration-200"
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
                                                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="getPaymentMethodBg(payment.paymentMethod)">
                                                    <Icon :name="getPaymentMethodIcon(payment.paymentMethod)" class="w-4 h-4" :class="getPaymentMethodIconColor(payment.paymentMethod)" />
                                                </div>
                                                <span class="text-sm font-medium text-gray-900">{{ getPaymentMethodLabel(payment.paymentMethod) }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-right whitespace-nowrap">
                                            <p class="text-sm font-semibold text-blue-600">
                                                {{ formatZar(payment.amount) }}
                                            </p>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">
                                            <span 
                                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                                                :class="getStatusClass(payment.status)"
                                            >
                                                {{ getStatusText(payment.status) }}
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
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getPaymentMethodBg(payment.paymentMethod)">
                                    <Icon :name="getPaymentMethodIcon(payment.paymentMethod)" class="w-5 h-5" :class="getPaymentMethodIconColor(payment.paymentMethod)" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">{{ getPaymentMethodLabel(payment.paymentMethod) }}</p>
                                    <p class="text-xs text-gray-500">{{ formatDate(payment.created) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <p class="text-sm font-bold text-blue-600">
                                    {{ formatZar(payment.amount) }}
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
                                <span class="text-xs font-medium text-gray-900 font-mono">{{ payment.reference || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Provider</span>
                                <span class="text-xs font-medium text-gray-900">{{ payment.provider || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Time</span>
                                <span class="text-xs font-medium text-gray-900">{{ formatTime(payment.created) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Method</span>
                                <span class="text-xs font-medium text-gray-900">{{ getPaymentMethodLabel(payment.paymentMethod) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Status</span>
                                <span 
                                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                    :class="getStatusClass(payment.status)"
                                >
                                    {{ getStatusText(payment.status) }}
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
      expandedRows: [],
      totalAmount: 0,
      totalCount: 0
    }
  },
  methods: {
    formatZar(value) {
      try {
        const num = Number(value) || 0
        return `R ${new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(num)}`
      } catch {
        const num = Number(value) || 0
        return `R ${num.toFixed(2)}`
      }
    },
    async fetchData() {
        this.isLoading = true;
        try {
          const response = await useWalletAuthFetch(`/pay/history`)
          this.fundingHistory = response.payments || [];
          this.totalAmount = response.totalAmount || 0;
          this.totalCount = response.totalCount || 0;
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
    
    getPaymentMethodIcon(method) {
        const methodLower = method?.toLowerCase() || '';
        if (methodLower.includes('card') || methodLower.includes('debit') || methodLower.includes('credit')) {
            return 'lucide:credit-card';
        }
        if (methodLower.includes('wallet')) {
            return 'lucide:wallet';
        }
        if (methodLower.includes('cash')) {
            return 'lucide:banknote';
        }
        return 'lucide:credit-card';
    },

    getPaymentMethodBg(method) {
        const methodLower = method?.toLowerCase() || '';
        if (methodLower.includes('card') || methodLower.includes('debit') || methodLower.includes('credit')) {
            return 'bg-blue-100';
        }
        if (methodLower.includes('wallet')) {
            return 'bg-purple-100';
        }
        if (methodLower.includes('cash')) {
            return 'bg-green-100';
        }
        return 'bg-gray-100';
    },

    getPaymentMethodIconColor(method) {
        const methodLower = method?.toLowerCase() || '';
        if (methodLower.includes('card') || methodLower.includes('debit') || methodLower.includes('credit')) {
            return 'text-blue-600';
        }
        if (methodLower.includes('wallet')) {
            return 'text-purple-600';
        }
        if (methodLower.includes('cash')) {
            return 'text-green-600';
        }
        return 'text-gray-600';
    },

    getPaymentMethodLabel(method) {
        if (!method) return 'N/A';
        // Format payment method labels
        if (method.includes(',')) {
            // Handle multiple methods like "DEBIT_CARD, Cash"
            return method.split(',').map(m => m.trim().replace(/_/g, ' ')).join(', ');
        }
        return method.replace(/_/g, ' ');
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
        if (statusLower === 'completed') {
            return 'bg-green-100 text-green-700';
        }
        if (statusLower === 'pending') {
            return 'bg-yellow-100 text-yellow-700';
        }
        if (statusLower === 'failed' || statusLower === 'cancelled') {
            return 'bg-red-100 text-red-700';
        }
        return 'bg-gray-100 text-gray-700';
    },

    getStatusText(status) {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'completed') {
            return 'Completed';
        }
        if (statusLower === 'pending') {
            return 'Pending';
        }
        if (statusLower === 'failed') {
            return 'Failed';
        }
        if (statusLower === 'cancelled') {
            return 'Cancelled';
        }
        return status || 'Unknown';
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
        return this.totalAmount || 0;
    },

    averageDeposit() {
        if (!this.totalCount || this.totalCount === 0) return 0;
        return this.totalAmount / this.totalCount;
    }
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