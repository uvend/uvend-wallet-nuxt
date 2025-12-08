<template>
    <div class="flex flex-col p-4 gap-4 overflow-hidden">
        <!-- Filter buttons in a scrollable container on mobile -->
        <!-- <div class="flex justify-between flex-wrap gap-2">
            <WalletUtilitySelector v-model="filterOptions" @update="console.log"/>
            <WalletDateRangeSelector @update="console.log"/>
        </div> -->
        
        <!-- Main Dashboard Grid: 2-column layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column: KPI Cards + Debit Card -->
            <div class="flex flex-col gap-4">
                <!-- KPI Cards -->
                <WalletKpiCards />
                
                <!-- Debit Card -->
                <WalletDebitCard @balance-updated="handleBalanceUpdate" />
                <div class="mt-6">
                <WalletRecentTransactions />
                </div>
            </div>
            
            <!-- Right Column: Balance History -->
            <div class="flex flex-col gap-4">
                <!-- Balance History Chart -->
                <!-- <WalletBalanceHistoryChart /> -->
            </div>
        </div>
        
        <!-- Recent Deductions Table -->
   
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'wallet'
})

const filterOptions = ref([
    { key: "all", value: "All Transactions" },
    { key: "elect", value: "Electricity" },
    { key: "water", value: "Water" },
    { key: "payments", value: "Payments" },
])

// Handle balance update from DebitCard component
function handleBalanceUpdate() {
    // Trigger refresh of components that depend on balance
    // You can emit events to child components or use a global store
    console.log('Balance updated - refreshing related components')
    
    // Force refresh of KPI cards by triggering a re-render
    // This is a simple approach - in a more complex app you'd use a store
    nextTick(() => {
        // Components will automatically refresh when balance changes
    })
}
</script>