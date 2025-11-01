<template>
    <Card class="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/20 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
        <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                        <Icon name="lucide:history" class="h-4 w-4 text-gray-600"/>
                    </div>
                    <CardTitle class="text-lg font-bold text-gray-900">Recent Transactions</CardTitle>
                </div>
                <Button 
                    variant="ghost" 
                    class="group/btn relative overflow-hidden text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300"
                    @click="navigateTo('/transactions')"
                >
                    <span class="relative z-10 flex items-center gap-1">
                        View all
                        <Icon name="lucide:arrow-right" class="h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-300"/>
                    </span>
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div v-if="isLoading" class="py-8 flex justify-center">
                <div class="flex flex-col items-center gap-3">
                    <MyLoader />
                    <p class="text-xs text-gray-500">Loading transactions...</p>
                </div>
            </div>
            <div v-else-if="recentTransactions.length > 0" class="space-y-3">
                <div v-for="transaction in recentTransactions" 
                     :key="transaction.id"
                     class="group/item relative overflow-hidden bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-200/50 p-3 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                    <!-- Desktop Layout -->
                    <div class="hidden sm:flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300"
                                 :class="transaction.type === 'electricity' ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-gradient-to-br from-blue-100 to-cyan-100'">
                                <Icon :name="transaction.type === 'electricity' ? 'lucide:zap' : 'lucide:droplet'" 
                                      :class="transaction.type === 'electricity' ? 'h-5 w-5 text-yellow-600' : 'h-5 w-5 text-blue-600'"/>
                            </div>
                            <div class="space-y-1">
                                <p class="text-sm font-bold text-gray-900">
                                    {{ transaction.type === 'electricity' ? 'Electricity prepaid purchase' : 'Water prepaid purchase' }}
                                </p>
                                <div class="flex items-center gap-2">
                                    <p class="text-xs text-gray-600 font-medium">
                                        {{ formatDate(transaction.date) }}
                                    </p>
                                    <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                                    <p class="text-xs text-gray-600 font-medium">
                                        {{ transaction.meterNumber }}
                                    </p>
                                </div>
                                <p v-if="getRemainingUnits(transaction)" class="text-xs text-gray-500 font-medium">
                                    {{ getRemainingUnits(transaction) }}
                                </p>
                                
                                <!-- Battery and State Info -->
                                <div v-if="hasValidBatteryOrState(transaction)" class="flex items-center gap-3 mt-2">
                                    <!-- Battery Status -->
                                    <div v-if="hasValidBattery(transaction)" class="flex items-center gap-1">
                                        <Icon name="lucide:battery" 
                                              :class="getBatteryColor(convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage))"
                                              class="w-3 h-3"/>
                                        <span class="text-xs font-medium"
                                              :class="getBatteryColor(convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage))">
                                            {{ convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage) }}%
                                        </span>
                                        <span class="text-xs text-gray-500">{{ transaction.latestReading.meterVoltage.Voltage.toFixed(2) }}V</span>
                                    </div>
                                    
                                    <!-- State Status -->
                                    <div v-if="hasValidState(transaction)" class="flex items-center gap-1">
                                        <div class="w-1.5 h-1.5 rounded-full"
                                             :class="transaction.latestReading.meterState.State === 1 ? 'bg-green-500' : 'bg-red-500'"></div>
                                        <span class="text-xs font-medium"
                                              :class="getStateColor(transaction.latestReading.meterState.State)">
                                            {{ transaction.latestReading.meterState.State === 1 ? 'Active' : 'Offline' }}
                                        </span>
                                    </div>
                                </div>
                                </div>
                            </div>
                        <div class="text-right">
                            <p class="text-lg font-bold"
                               :class="transaction.type === 'electricity' ? 'text-orange-600' : 'text-blue-600'">
                                -{{ formatAmount(transaction.amount) }}
                            </p>
                            <p v-if="transaction.totalUnits" class="text-xs text-gray-600 font-medium mt-1">
                                {{ transaction.totalUnits }} units
                            </p>
                            <!-- <div class="flex items-center gap-1 mt-1">
                                <div class="w-1.5 h-1.5 rounded-full"
                                     :class="transaction.type === 'electricity' ? 'bg-orange-400' : 'bg-blue-400'"></div>
                                <p class="text-xs text-gray-500 font-medium">Debit</p>
                            </div> -->
                    </div>
                </div>

                    <!-- Mobile Layout -->
                    <div class="sm:hidden space-y-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                                     :class="transaction.type === 'electricity' ? 'bg-orange-100' : 'bg-blue-100'">
                                    <Icon :name="transaction.type === 'electricity' ? 'lucide:zap' : 'lucide:droplet'" 
                                          :class="transaction.type === 'electricity' ? 'h-4 w-4 text-orange-600' : 'h-4 w-4 text-blue-600'"/>
                                </div>
                                <div>
                                    <p class="text-xs font-mono text-gray-700 font-medium">{{ transaction.meterNumber }}</p>
                                    <p class="text-xs text-gray-500">{{ formatDate(transaction.date) }}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold"
                                   :class="transaction.type === 'electricity' ? 'text-orange-600' : 'text-blue-600'">
                                    -{{ formatAmount(transaction.amount) }}
                                </p>
                                <p v-if="transaction.totalUnits" class="text-xs text-gray-600 font-medium mt-1">
                                    {{ transaction.totalUnits }} units
                                </p>
                            </div>
                        </div>
                        <div v-if="getRemainingUnits(transaction)" class="flex items-center gap-2">
                            <div class="w-1.5 h-1.5 rounded-full"
                                 :class="transaction.type === 'electricity' ? 'bg-orange-400' : 'bg-blue-400'"></div>
                            <p class="text-xs text-gray-600 font-medium">{{ getRemainingUnits(transaction) }}</p>
                        </div>

                        <!-- Battery and State Info - Mobile -->
                        <div v-if="hasValidBatteryOrState(transaction)" class="flex items-center justify-between">
                            <!-- Battery Status -->
                            <div v-if="hasValidBattery(transaction)" class="flex items-center gap-1">
                                <Icon name="lucide:battery" 
                                      :class="getBatteryColor(convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage))"
                                      class="w-3 h-3"/>
                                <span class="text-xs font-medium"
                                      :class="getBatteryColor(convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage))">
                                    {{ convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage) }}%
                                </span>
                            </div>
                            
                            <!-- State Status -->
                            <div v-if="hasValidState(transaction)" class="flex items-center gap-1">
                                <div class="w-1.5 h-1.5 rounded-full"
                                     :class="transaction.latestReading.meterState.State === 1 ? 'bg-green-500' : 'bg-red-500'"></div>
                                <span class="text-xs font-medium"
                                      :class="getStateColor(transaction.latestReading.meterState.State)">
                                    {{ transaction.latestReading.meterState.State === 1 ? 'Active' : 'Offline' }}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Subtle gradient overlay -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-100/20 pointer-events-none"></div>
                </div>
            </div>
            <div v-else class="py-12 text-center">
                <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Icon name="lucide:receipt" class="h-8 w-8 text-gray-400"/>
                    </div>
                    <div class="space-y-1">
                        <p class="text-lg font-semibold text-gray-500">No recent transactions</p>
                        <p class="text-sm text-gray-400">Your transaction history will appear here</p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const recentTransactions = ref([])

function formatAmount(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

function formatDate(dateString) {
    try {
    const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            return 'Invalid Date'
        }
    return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
    } catch (error) {
        console.warn('Error formatting date:', dateString, error)
        return 'Invalid Date'
    }
}

function getRemainingUnits(transaction) {
    if (!transaction.latestReading || !transaction.latestReading.remainingTokens) {
        return '';
    }
    
    if (transaction.type === 'electricity') {
        const credit = transaction.latestReading.remainingTokens["Remaining Credit"];
        if (credit !== null && credit !== undefined && credit >= 0) {
            return `${(parseFloat(credit) / 1000).toFixed(2)} KWh`;
        }
    } else if (transaction.type === 'water') {
        const litres = transaction.latestReading.remainingTokens["Remaining Litres"];
        if (litres !== null && litres !== undefined && litres >= 0) {
            return `${(parseFloat(litres) ).toFixed(2)} L`;
        }
    }
    
    return '';
}

// Battery and voltage methods
function convertVoltageToBattery(voltage) {
    if (!voltage || isNaN(voltage)) return 0;
    
    const minVoltage = 3.0;
    const maxVoltage = 3.7;
    
    const percentage = Math.min(100, Math.max(0, 
        ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100
    ));
    
    return Math.round(percentage);
}

function getBatteryColor(percentage) {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage >= 20) return 'text-orange-600';
    return 'text-red-600';
}

// State methods
function getStateColor(state) {
    if (state === 1) return 'text-green-600';
    if (state === 0) return 'text-red-600';
    return 'text-gray-600';
}

// Validation methods
function hasValidBattery(transaction) {
    return transaction.latestReading && 
           transaction.latestReading.meterVoltage && 
           transaction.latestReading.meterVoltage.Voltage !== null && 
           transaction.latestReading.meterVoltage.Voltage !== undefined &&
           transaction.latestReading.meterVoltage.Voltage >= 0;
}

function hasValidState(transaction) {
    return transaction.latestReading && 
           transaction.latestReading.meterState && 
           transaction.latestReading.meterState.State !== null && 
           transaction.latestReading.meterState.State !== undefined &&
           (transaction.latestReading.meterState.State === 0 || transaction.latestReading.meterState.State === 1);
}

function hasValidBatteryOrState(transaction) {
    return hasValidBattery(transaction) || hasValidState(transaction);
}

async function fetchRecentTransactions() {
    isLoading.value = true
    try {
        // Fetch transactions data
        const transactionsResponse = await useWalletAuthFetch(`/meter/token/history`)
        
        // Store the totals from the response for potential future use
        const transactionTotals = {
            totalAmount: parseFloat(transactionsResponse.totalAmount || 0),
            electricityTotal: parseFloat(transactionsResponse.electricityTotal || 0),
            waterTotal: parseFloat(transactionsResponse.waterTotal || 0)
        }
        
        // Process and format recent transactions (last 4)
        recentTransactions.value = transactionsResponse.transactions
            .slice(0, 4)
            .map(transaction => {
                
                const totalUnitsPaid = JSON.parse(transaction.vendResponse).listOfTokenTransactions[0]?.tokens[0]?.units || ""
                return {
                id: transaction.id || transaction.meterNumber + transaction.created,
                type: transaction.utilityType === 'Electricity' ? 'electricity' : 'water',
                date: transaction.created,
                meterNumber: transaction.meterNumber,
                totalUnits:totalUnitsPaid,
                amount: parseFloat(transaction.amount),
                latestReading: transaction.latestReading
            }})
            // console.log(recentTransactions.value)
    } catch (error) {
        console.error('Error fetching recent transactions:', error)
        // Show sample data if API fails
       
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchRecentTransactions()
})
</script>

<style scoped>
/* Custom scrollbar for transaction list */
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
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
