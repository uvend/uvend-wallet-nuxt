<template>
<div class="flex flex-col p-4 gap-6">
    <!-- Wallet Card and Meter Spending Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
    <!-- Wallet Card -->
         
    <WalletDebitCard />
        
        <!-- Meter Spending Chart -->
       
    </div>



    <!-- Summary Statistics -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Spent -->
        <Card class="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:coins" class="w-4 h-4 text-purple-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Total Spent</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">R {{ totalSpent }}</p>
                <p class="text-xs text-gray-500 mt-1">Lifetime</p>
            </CardContent>
        </Card>

        <!-- Average per Transaction -->
        <Card class="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:trending-up" class="w-4 h-4 text-green-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Average</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">R {{ averageTransaction }}</p>
                <p class="text-xs text-gray-500 mt-1">Lifetime average</p>
            </CardContent>
        </Card>

        <!-- Highest Utility -->
        <Card class="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="highestUtility.bgClass">
                        <Icon :name="highestUtility.icon" class="w-4 h-4" :class="highestUtility.iconClass" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Highest</span>
                </div>
                <p class="text-2xl font-bold" :class="highestUtility.textClass">{{ highestUtility.name }}</p>
                <p class="text-xs text-gray-500 mt-1">R {{ highestUtility.amount }} lifetime</p>
            </CardContent>
        </Card>

        <!-- Lowest Utility -->
        <Card class="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="lowestUtility.bgClass">
                        <Icon :name="lowestUtility.icon" class="w-4 h-4" :class="lowestUtility.iconClass" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Lowest</span>
                </div>
                <p class="text-2xl font-bold" :class="lowestUtility.textClass">{{ lowestUtility.name }}</p>
                <p class="text-xs text-gray-500 mt-1">R {{ lowestUtility.amount }} lifetime</p>
            </CardContent>
        </Card>
    </div>
        <!-- My Meters Section -->
    <Card class="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
            <CardTitle class="text-lg font-semibold text-gray-800">My Meters</CardTitle>
            <CardDescription class="text-sm">Manage and purchase tokens for your utility meters</CardDescription>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-medium text-gray-700">Filter by Utility</label>
                        <Select v-model="selectedMeterFilter" @update:modelValue="handleMeterFilterChange">
                            <SelectTrigger class="w-full sm:w-48 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm">
                                <SelectValue placeholder="All Meters" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Meters</SelectItem>
                                <SelectItem value="Electricity">Electricity Only</SelectItem>
                                <SelectItem value="Water">Water Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-medium text-gray-700">Actions</label>
                        <WalletPopup buttonLabel="Add Meter" v-model="showAddMeterDialog">
                            <WalletAddMeter @success="onMeterAdded()"/>
                        </WalletPopup>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent class="p-0">
            <div v-if="metersLoading" class="py-8 flex justify-center">
                <MyLoader />
            </div>
            <div v-else-if="meters && meters.length > 0" class="divide-y divide-gray-100">
                <div v-for="meter in meters" :key="meter.meterNumber" class="p-6">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <!-- Meter Info -->
                        <div class="flex items-center gap-4 flex-1">
                            <!-- Service Icon -->
                            <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                 :class="getServiceIconBg(meter.utilityType || 'all')">
                                <Icon :name="getServiceIcon(meter.utilityType || 'all')" 
                                      :class="getServiceIconColor(meter.utilityType || 'all')"
                                      class="w-6 h-6"/>
                            </div>
                            
                            <!-- Meter Details -->
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                    <h3 class="text-lg font-bold text-gray-900 truncate">{{ meter.name }}</h3>
                                    <!-- State Badge -->
                                    <div v-if="hasValidState(meter)" class="flex items-center gap-1 px-2 py-1 rounded-lg w-fit"
                                         :class="getStateBgColor(meter.latestReading.meterState.State)">
                                        <div class="w-2 h-2 rounded-full"
                                             :class="meter.latestReading.meterState.State === 1 ? 'bg-green-500' : 'bg-red-500'"></div>
                                        <span class="text-xs font-medium"
                                              :class="getStateColor(meter.latestReading.meterState.State)">
                                            {{ meter.latestReading.meterState.State === 1 ? 'Active' : 'Offline' }}
                                        </span>
                                    </div>
                                </div>
                                <p class="text-sm font-medium text-gray-600 mb-1">{{ meter.meterNumber }}</p>
                                <p class="text-xs text-gray-500 capitalize">{{ meter.utilityType || 'General' }}</p>
                                
                                <!-- Meter Status Row -->
                                <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                                    <!-- Remaining Units Display -->
                                    <div v-if="getRemainingUnits(meter)" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm"
                                         :class="getRemainingUnitsBg(meter.utilityType)">
                                        <div class="w-2 h-2 rounded-full animate-pulse"
                                             :class="getRemainingUnitsDot(meter.utilityType)"></div>
                                        <span class="text-xs font-semibold"
                                              :class="getRemainingUnitsText(meter.utilityType)">
                                            {{ getRemainingUnits(meter) }}
                                        </span>
                                        <Icon :name="getRemainingUnitsIcon(meter.utilityType)" 
                                              class="w-3 h-3"
                                              :class="getRemainingUnitsIconColor(meter.utilityType)"/>
                                    </div>
                                    
                                    <!-- Battery Status -->
                                    <div v-if="hasValidBattery(meter)" class="flex items-center gap-2">
                                        <div class="flex items-center gap-1">
                                            <Icon name="lucide:battery" 
                                                  :class="getBatteryColor(convertVoltageToBattery(meter.latestReading.meterVoltage.Voltage))"
                                                  class="w-3 h-3"/>
                                            <span class="text-xs font-medium"
                                                  :class="getBatteryColor(convertVoltageToBattery(meter.latestReading.meterVoltage.Voltage))">
                                                {{ convertVoltageToBattery(meter.latestReading.meterVoltage.Voltage) }}%
                                            </span>
                                        </div>
                                        <span class="text-xs text-gray-500">{{ meter.latestReading.meterVoltage.Voltage.toFixed(2) }}V</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div v-else class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="lucide:home" class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-gray-600 font-medium">No meters found</p>
                <p class="text-gray-400 text-sm mt-1">Add your first meter to get started</p>
            </div>
        </CardContent>
    </Card>

    <!-- Usage Trends Chart -->
    <UsageTrendsChart :meters="meters || []" :isLoading="isLoading || metersLoading" />
        

    <!-- Transactions Table -->
    <Card class="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden ">
        <CardHeader>
            <CardTitle class="text-lg font-semibold text-gray-800">Transaction History</CardTitle>
            <CardDescription class="text-sm">{{ summary.transactionCount }} transactions found</CardDescription>
        </CardHeader>
        <CardContent class="p-0">
            <div v-if="isLoading" class="py-8 flex justify-center">
                <MyLoader />
            </div>
            <div v-else-if="transactions.length > 0">
                <!-- Desktop Table - Scrollable -->
                <div class="hidden md:block overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                        <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            <table class="min-w-[1000px] w-full">
                                <thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th class="text-left py-3 px-2 text-xs font-semibold text-gray-700 w-[140px]">Date & Time</th>
                                        <th class="text-left py-3 px-2 text-xs font-semibold text-gray-700 w-[140px]">Service</th>
                                        <th class="text-left py-3 px-2 text-xs font-semibold text-gray-700 w-[140px]">Meter Number</th>
                                        <th class="text-left py-3 px-2 text-xs font-semibold text-gray-700 w-[90px]">Battery</th>
                                        <th class="text-center py-3 px-2 text-xs font-semibold text-gray-700 w-[90px]">State</th>
                                        <th class="text-right py-3 px-2 text-xs font-semibold text-gray-700 w-[110px]">Amount</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100 bg-white">
                                    <tr v-for="transaction in transactions" 
                                        :key="transaction.id"
                                        class="hover:bg-orange-50/50 transition-colors duration-200"
                                    >
                                        <td class="py-3 px-2 whitespace-nowrap">
                                            <p class="text-sm font-medium text-gray-900">{{ formatDate(transaction.created) }}</p>
                                            <p class="text-xs text-gray-500">{{ formatTime(transaction.created) }}</p>
                                        </td>
                                        <td class="py-3 px-2 whitespace-nowrap">
                                            <div class="flex items-center gap-2">
                                                <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border" :class="getUtilityBg(transaction.utilityType)">
                                                    <Icon :name="getUtilityIcon(transaction.utilityType)" class="w-4 h-4" :class="getUtilityIconClass(transaction.utilityType)" />
                                                </div>
                                                <div>
                                                    <span class="text-sm font-semibold text-gray-900">{{ transaction.utilityType }}</span>
                                                    <p class="text-xs text-gray-500">Utility Service</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-2 whitespace-nowrap">
                                            <p class="text-sm text-gray-900 font-mono">{{ transaction.meterNumber }}</p>
                                            <div v-if="getRemainingUnits(transaction)" class="mt-1">
                                                <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm"
                                                 :class="getRemainingUnitsBg(transaction.utilityType)">
                                                <div class="w-1.5 h-1.5 rounded-full animate-pulse"
                                                     :class="getRemainingUnitsDot(transaction.utilityType)"></div>
                                                <span class="text-xs font-semibold"
                                                      :class="getRemainingUnitsText(transaction.utilityType)">
                                                    {{ getRemainingUnits(transaction) }}
                                                </span>
                                            </div>
                                            </div>
                                        </td>
                                        
                                        <!-- Battery Column -->
                                        <td class="py-3 px-2 whitespace-nowrap">
                                            <div v-if="hasValidBattery(transaction)" class="flex items-center gap-1">
                                                <Icon name="lucide:battery" 
                                                      :class="getBatteryColor(convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage))"
                                                      class="w-3 h-3"/>
                                                <div class="flex flex-col">
                                                    <span class="text-xs font-semibold"
                                                          :class="getBatteryColor(convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage))">
                                                        {{ convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage) }}%
                                                    </span>
                                                    <span class="text-xs text-gray-500">{{ transaction.latestReading.meterVoltage.Voltage.toFixed(2) }}V</span>
                                                </div>
                                            </div>
                                            <span v-else class="text-xs text-gray-400">No data</span>
                                        </td>
                                        
                                        <!-- State Column -->
                                        <td class="py-3 px-2 text-center whitespace-nowrap">
                                            <div v-if="hasValidState(transaction)" class="inline-flex items-center gap-1 px-2 py-1 rounded-md"
                                                 :class="getStateBg(transaction.latestReading.meterState.State)">
                                                <div class="w-1.5 h-1.5 rounded-full"
                                                     :class="transaction.latestReading.meterState.State === 1 ? 'bg-green-500' : 'bg-red-500'"></div>
                                                <span class="text-xs font-semibold"
                                                      :class="getStateText(transaction.latestReading.meterState.State)">
                                                    {{ transaction.latestReading.meterState.State === 1 ? 'Active' : 'Offline' }}
                                                </span>
                                            </div>
                                            <span v-else class="text-xs text-gray-400">No data</span>
                                        </td>
                                      
                                        <td class="py-3 px-2 text-right whitespace-nowrap">
                                            <p class="text-sm font-semibold" :class="getAmountClass(transaction.utilityType)">
                                                R {{ parseFloat(transaction.amount).toFixed(2) }}
                                            </p>
                                            <p v-if="transaction.unitsIssued" class="text-xs text-gray-600 font-medium mt-1">
                                                {{ transaction.unitsIssued }} units
                                            </p>
                                            <p v-if="transaction.delimitedTokenNumber" class="text-xs text-gray-500 font-mono mt-1">
                                                {{ transaction.delimitedTokenNumber }}
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
        </div>

                <!-- Mobile Cards -->
                <div class="md:hidden divide-y divide-gray-100">
                    <div v-for="transaction in transactions" 
                         :key="transaction.id"
                         class="p-4"
                    >
                        <!-- Collapsed View -->
                        <div 
                            class="flex items-center justify-between cursor-pointer"
                            @click="toggleExpand(transaction.id)"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border" :class="getUtilityBg(transaction.utilityType)">
                                    <Icon :name="getUtilityIcon(transaction.utilityType)" class="w-6 h-6" :class="getUtilityIconClass(transaction.utilityType)" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">{{ transaction.utilityType }}</p>
                                    <p class="text-xs text-gray-500">{{ formatDate(transaction.created) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="text-right">
                                <p class="text-sm font-bold" :class="getAmountClass(transaction.utilityType)">
                                    R {{ parseFloat(transaction.amount).toFixed(2) }}
                                </p>
                                    <p v-if="transaction.unitsIssued" class="text-xs text-gray-600 font-medium mt-1">
                                        {{ transaction.unitsIssued }} units
                                    </p>
                                    <p v-if="transaction.delimitedTokenNumber" class="text-xs text-gray-500 font-mono mt-1">
                                        {{ transaction.delimitedTokenNumber }}
                                    </p>
                                </div>
                                <Icon 
                                    :name="expandedRows.includes(transaction.id) ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                                    class="w-5 h-5 text-gray-500 transition-colors duration-200"
                                />
                            </div>
        </div>

                        <!-- Expanded View -->
                        <div v-if="expandedRows.includes(transaction.id)" class="mt-4 space-y-3 bg-gray-50 p-3 rounded-lg">
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Meter Number</span>
                                <div class="text-right">
                                <span class="text-xs font-medium text-gray-900 font-mono">{{ transaction.meterNumber }}</span>
                                    <div v-if="getRemainingUnits(transaction)" class="mt-1">
                                <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm"
                                     :class="getRemainingUnitsBg(transaction.utilityType)">
                                    <div class="w-1.5 h-1.5 rounded-full animate-pulse"
                                         :class="getRemainingUnitsDot(transaction.utilityType)"></div>
                                    <span class="text-xs font-semibold"
                                          :class="getRemainingUnitsText(transaction.utilityType)">
                                        {{ getRemainingUnits(transaction) }}
                                    </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            
                            <!-- Battery Status - Enhanced -->
                            <div v-if="hasValidBattery(transaction)" class="flex justify-between items-center">
                                <span class="text-xs text-gray-600">Battery</span>
                                <div class="flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm bg-white">
                                    <Icon name="lucide:battery" 
                                          :class="getBatteryColor(convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage))"
                                          class="w-3 h-3"/>
                                    <div class="flex flex-col">
                                        <span class="text-xs font-semibold"
                                              :class="getBatteryColor(convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage))">
                                            {{ convertVoltageToBattery(transaction.latestReading.meterVoltage.Voltage) }}%
                                        </span>
                                        <span class="text-xs text-gray-500">{{ transaction.latestReading.meterVoltage.Voltage.toFixed(2) }}V</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Meter State - Enhanced -->
                            <div v-if="hasValidState(transaction)" class="flex justify-between items-center">
                                <span class="text-xs text-gray-600">State</span>
                                <div class="inline-flex items-center gap-1 px-2 py-1 rounded-md"
                                     :class="getStateBg(transaction.latestReading.meterState.State)">
                                    <div class="w-1.5 h-1.5 rounded-full"
                                         :class="transaction.latestReading.meterState.State === 1 ? 'bg-green-500' : 'bg-red-500'"></div>
                                    <span class="text-xs font-semibold"
                                          :class="getStateText(transaction.latestReading.meterState.State)">
                                        {{ transaction.latestReading.meterState.State === 1 ? 'Active' : 'Offline' }}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Time</span>
                                <span class="text-xs font-medium text-gray-900">{{ formatTime(transaction.created) }}</span>
                            </div>
                            
                            <div v-if="transaction.token" class="pt-2 border-t border-gray-200">
                                <span class="text-xs text-gray-600">Token</span>
                                <p class="text-xs font-mono text-gray-900 mt-1 break-all">{{ transaction.token }}</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
            <div v-else class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="lucide:receipt" class="w-8 h-8 text-gray-400" />
    </div>
                <p class="text-gray-600 font-medium">No transactions found</p>
                <p class="text-gray-400 text-sm mt-1">Transactions will appear here when they occur</p>
    </div>
        </CardContent>
    </Card>
    
    
</div>
</template>

<script>
import UsageTrendsChart from '~/components/wallet/SpendingTrendsChart.vue'

definePageMeta({
    layout: 'wallet'
})

  export default {
    components: {
      UsageTrendsChart
    },
    data() {
      return {
            isLoading: false,
        activeFilter: null,
            transactions: [],
            chartData: [],
        summary: {
                totalSpent: '0.00',
                transactionCount: 0
            },
            startDate: null,
            endDate: null,
            expandedRows: [],
            // Meters data
            meters: [],
            metersLoading: false,
            // Transaction totals from API
            transactionTotals: {
                totalAmount: 0,
                electricityTotal: 0,
                waterTotal: 0
            },
            // Meter filter
            selectedMeterFilter: 'all',
            allMeters: [],
            // Add meter dialog
            showAddMeterDialog: false
        }
    },
    methods: {
      async fetchTransactionsData() {
        this.isLoading = true;        
        try {
                const response = await useWalletAuthFetch(`/meter/token/history`, {
          })
          this.transactions = response.transactions;
          this.summary.totalSpent = Number(response.totalAmount).toFixed(2)
          this.summary.transactionCount = this.transactions.length;
         
                // Store the totals from the response instead of calculating
                this.transactionTotals = {
                    totalAmount: parseFloat(response.totalAmount || 0),
                    electricityTotal: parseFloat(response.electricityTotal || 0),
                    waterTotal: parseFloat(response.waterTotal || 0)
                }
         
                // Add unitsIssued to each transaction
                this.transactions = this.transactions.map(transaction => {
                    const unitsIssued = JSON.parse(transaction.vendResponse).listOfTokenTransactions[0]?.tokens[0]?.units || ""
                    const delimitedTokenNumber = JSON.parse(transaction.vendResponse).listOfTokenTransactions[0]?.tokens[0]?.delimitedTokenNumber || ""
                    return {
                        ...transaction,
                        unitsIssued: unitsIssued,
                        delimitedTokenNumber:delimitedTokenNumber
                    }
                })
         
                // Prepare chart data
                this.chartData = this.transactions.map(t => ({
                    transactionDate: t.created,
                    managedTenderAmount: parseFloat(t.amount),
                    utilityType: t.utilityType
                }))

        } catch (error) {
          console.error('Error fetching transactions data:', error);
          this.$toast({
            title: 'Error',
            description: 'Failed to load transactions data',
            variant: 'destructive'
          });
        } finally {
          this.isLoading = false;
        }
      },
      
        getUtilityIcon(type) {
            return type === 'Electricity' ? 'lucide:zap' : 'lucide:droplet'
        },

        getUtilityBg(type) {
            return type === 'Electricity' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
        },

        getUtilityIconClass(type) {
            return type === 'Electricity' ? 'text-orange-600' : 'text-blue-600'
        },

        getAmountClass(type) {
            return type === 'Electricity' ? 'text-orange-600' : 'text-blue-600'
        },
        
        // Battery and voltage methods
        convertVoltageToBattery(voltage) {
            if (!voltage || isNaN(voltage)) return 0;
            
            const minVoltage = 3.0;
            const maxVoltage = 3.7;
            
            const percentage = Math.min(100, Math.max(0, 
                ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100
            ));
            
            return Math.round(percentage);
        },
        getBatteryColor(percentage) {
            if (percentage >= 80) return 'text-green-600';
            if (percentage >= 50) return 'text-yellow-600';
            if (percentage >= 20) return 'text-orange-600';
            return 'text-red-600';
        },
        
        
        // State styling methods
        getStateBg(state) {
            if (state === 1) return 'bg-green-100 border-green-200';
            if (state === 0) return 'bg-red-100 border-red-200';
            return 'bg-gray-100 border-gray-200';
        },
        getStateText(state) {
            if (state === 1) return 'text-green-700';
            if (state === 0) return 'text-red-700';
            return 'text-gray-700';
        },


        formatDate(dateString) {
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    return 'Invalid Date';
                }
            return date.toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
                });
            } catch (error) {
                console.warn('Error formatting date:', dateString, error);
                return 'Invalid Date';
            }
        },

        formatTime(dateString) {
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    return 'Invalid Time';
                }
            return date.toLocaleTimeString('en-ZA', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
                });
            } catch (error) {
                console.warn('Error formatting time:', dateString, error);
                return 'Invalid Time';
            }
        },

        formatDateForAPI(rawDate) {
        return rawDate.toISOString();
      },

        setDateRange(newValue) {
        const startDate = new Date();
        const endDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
    
        
        this.startDate = this.formatDateForAPI(startDate);
        this.endDate = this.formatDateForAPI(endDate);
        },


        toggleExpand(transactionId) {
            const index = this.expandedRows.indexOf(transactionId)
            if (index > -1) {
                this.expandedRows.splice(index, 1)
            } else {
                this.expandedRows.push(transactionId)
            }
        },
        

        // Meters methods
        async fetchMeters() {
            this.metersLoading = true;
            try {
                const metersStore = useMetersStore();
                // Fetch from store if already loaded, otherwise fetch from API
                if (metersStore.isLoaded && metersStore.meters.length > 0) {
                    this.allMeters = [...metersStore.meters];
                    this.meters = [...metersStore.meters];
                } else {
                    const response = await useWalletAuthFetch(`/meter`)
                    const meters = response.meters || [];
                    // Update store with fetched meters
                    metersStore.setMeters(meters);
                    this.allMeters = [...meters];
                    this.meters = [...meters];
                }
            } catch (error) {
                console.error('Error fetching meters:', error);
                this.$toast({
                    title: 'Error',
                    description: 'Failed to load meters',
                    variant: 'destructive'
                });
            } finally {
                this.metersLoading = false;
            }
        },
        
        async refreshMeters() {
            // Refresh meters from API and update store
            const metersStore = useMetersStore();
            try {
                const response = await useWalletAuthFetch(`/meter`)
                const meters = response.meters || [];
                // Update store with fresh meters
                metersStore.setMeters(meters);
                this.allMeters = [...meters];
                // Apply current filter
                this.filterMeters();
            } catch (error) {
                console.error('Error refreshing meters:', error);
            }
        },
        
        
        
        // Meter filter method
        handleMeterFilterChange(filter) {
            this.selectedMeterFilter = filter;
            this.filterMeters();
        },

        filterMeters() {
            if (this.selectedMeterFilter === 'all') {
                this.meters = [...this.allMeters];
            } else {
                this.meters = this.allMeters.filter(meter => 
                    meter.utilityType === this.selectedMeterFilter
                );
            }
        },
        
        getServiceIcon(serviceType) {
            const iconMap = {
                'electricity': 'lucide:zap',
                'elect': 'lucide:zap',
                'water': 'lucide:droplet',
                'all': 'lucide:grid-3x3',
                'gas': 'lucide:flame',
                'internet': 'lucide:wifi',
                'mobile': 'lucide:smartphone'
            };
            return iconMap[serviceType?.toLowerCase()] || 'lucide:home';
        },
        
        getServiceIconBg(serviceType) {
            const bgMap = {
                'electricity': 'bg-gradient-to-br from-orange-100 to-orange-200',
                'elect': 'bg-gradient-to-br from-orange-100 to-orange-200',
                'water': 'bg-gradient-to-br from-blue-100 to-blue-200',
                'all': 'bg-gradient-to-br from-gray-100 to-gray-200',
                'gas': 'bg-gradient-to-br from-red-100 to-red-200',
                'internet': 'bg-gradient-to-br from-purple-100 to-purple-200',
                'mobile': 'bg-gradient-to-br from-green-100 to-green-200'
            };
            return bgMap[serviceType?.toLowerCase()] || 'bg-gradient-to-br from-gray-100 to-gray-200';
        },
        
        getServiceIconColor(serviceType) {
            const colorMap = {
                'electricity': 'text-orange-600',
                'elect': 'text-orange-600',
                'water': 'text-blue-600',
                'all': 'text-gray-600',
                'gas': 'text-red-600',
                'internet': 'text-purple-600',
                'mobile': 'text-green-600'
            };
            return colorMap[serviceType?.toLowerCase()] || 'text-gray-600';
        },
        
        getStateColor(state) {
            if (state === 1) return 'text-green-600';
            if (state === 0) return 'text-red-600';
            return 'text-gray-600';
        },
        
        getStateBgColor(state) {
            if (state === 1) return 'bg-green-100';
            if (state === 0) return 'bg-red-100';
            return 'bg-gray-100';
        },
        
        getRemainingUnits(meter) {
            if (!meter.latestReading || !meter.latestReading.remainingTokens) {
                return '';
            }
            
            if (meter.utilityType === 'Electricity') {
                const credit = meter.latestReading.remainingTokens["Remaining Credit"];
                if (credit !== null && credit !== undefined && credit >= 0) {
                    return `${(parseFloat(credit) / 1000).toFixed(2)} KWh`;
                }
            } else if (meter.utilityType === 'Water') {
                const litres = meter.latestReading.remainingTokens["Remaining Litres"];
                if (litres !== null && litres !== undefined && litres >= 0) {
                    return `${(parseFloat(litres) ).toFixed(2)} L`;
                }
            }
            
            return '';
        },
        
        getRemainingUnitsBg(utilityType) {
            if (utilityType === 'Electricity') {
                return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
            } else if (utilityType === 'Water') {
                return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200';
            }
            return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
        },
        
        getRemainingUnitsDot(utilityType) {
            if (utilityType === 'Electricity') {
                return 'bg-orange-400';
            } else if (utilityType === 'Water') {
                return 'bg-blue-400';
            }
            return 'bg-gray-400';
        },
        
        getRemainingUnitsText(utilityType) {
            if (utilityType === 'Electricity') {
                return 'text-orange-700';
            } else if (utilityType === 'Water') {
                return 'text-blue-700';
            }
            return 'text-gray-700';
        },
        
        getRemainingUnitsIcon(utilityType) {
            if (utilityType === 'Electricity') {
                return 'lucide:zap';
            } else if (utilityType === 'Water') {
                return 'lucide:droplet';
            }
            return 'lucide:activity';
        },
        
        getRemainingUnitsIconColor(utilityType) {
            if (utilityType === 'Electricity') {
                return 'text-orange-600';
            } else if (utilityType === 'Water') {
                return 'text-blue-600';
            }
            return 'text-gray-600';
        },
        
        // Validation methods
        hasValidBattery(transaction) {
            return transaction.latestReading && 
                   transaction.latestReading.meterVoltage && 
                   transaction.latestReading.meterVoltage.Voltage !== null && 
                   transaction.latestReading.meterVoltage.Voltage !== undefined &&
                   transaction.latestReading.meterVoltage.Voltage >= 0;
        },
        
        hasValidState(transaction) {
            return transaction.latestReading && 
                   transaction.latestReading.meterState && 
                   transaction.latestReading.meterState.State !== null && 
                   transaction.latestReading.meterState.State !== undefined &&
                   (transaction.latestReading.meterState.State === 0 || transaction.latestReading.meterState.State === 1);
        },
        
        onMeterAdded() {
            console.log('onMeterAdded called - refreshing page');
            
            // Close the dialog first
            this.showAddMeterDialog = false;
            
            // Show success toast
            this.$toast({
                title: 'Meter Added Successfully',
                description: 'Refreshing page to load updated meters...',
                variant: 'default'
            });
            
            // Refresh the page after a brief delay to show the toast
            setTimeout(() => {
                console.log('Executing page refresh');
                location.reload();
            }, 1000);
        }
    },
        
        async mounted() {
        this.setDateRange('30days');
        // Fetch both transactions and meters data
        await Promise.all([
            this.fetchTransactionsData(),
            this.fetchMeters()
        ]);
    },

    watch: {
        '$store.dateRange'(newValue) {
        this.setDateRange(newValue)
        this.fetchTransactionsData();
      },
        '$store.utilityType'(newValue) {
        this.activeFilter = newValue;
        this.fetchTransactionsData();
        }
    },
    
    computed: {
        totalSpent() {
            return this.transactionTotals.totalAmount.toFixed(2);
        },
        
        averageTransaction() {
            if (!this.summary.transactionCount || this.summary.transactionCount === 0) return '0.00';
            return (this.transactionTotals.totalAmount / this.summary.transactionCount).toFixed(2);
        },
        
        electricityTotal() {
            return this.transactionTotals.electricityTotal;
        },
        
        waterTotal() {
            return this.transactionTotals.waterTotal;
        },
        
        highestUtility() {
            const elecTotal = this.electricityTotal;
            const waterTotal = this.waterTotal;
            
            if (elecTotal > waterTotal) {
                return {
                    name: 'Electricity',
                    amount: elecTotal.toFixed(2),
                    icon: 'lucide:zap',
                    bgClass: 'bg-orange-100',
                    iconClass: 'text-orange-600',
                    textClass: 'text-orange-600'
                };
            } else {
                return {
                    name: 'Water',
                    amount: waterTotal.toFixed(2),
                    icon: 'lucide:droplet',
                    bgClass: 'bg-blue-100',
                    iconClass: 'text-blue-600',
                    textClass: 'text-blue-600'
                };
            }
        },
        
        lowestUtility() {
            const elecTotal = this.electricityTotal;
            const waterTotal = this.waterTotal;
            
            if (elecTotal < waterTotal) {
                return {
                    name: 'Electricity',
                    amount: elecTotal.toFixed(2),
                    icon: 'lucide:zap',
                    bgClass: 'bg-orange-100',
                    iconClass: 'text-orange-600',
                    textClass: 'text-orange-600'
                };
            } else {
                return {
                    name: 'Water',
                    amount: waterTotal.toFixed(2),
                    icon: 'lucide:droplet',
                    bgClass: 'bg-blue-100',
                    iconClass: 'text-blue-600',
                    textClass: 'text-blue-600'
                };
            }
        }
    }
  }
  </script>

<style scoped>
/* Custom scrollbar for transaction table */
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
  