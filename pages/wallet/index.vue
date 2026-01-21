<template>
    <div class="flex flex-col p-4 gap-6 overflow-hidden">
        <!-- Filter buttons in a scrollable container on mobile -->
        <!-- <div class="flex justify-between flex-wrap gap-2">
            <WalletUtilitySelector v-model="filterOptions" @update="console.log"/>
            <WalletDateRangeSelector @update="console.log"/>
        </div> -->
        
        <!-- Main Dashboard Grid: 2-column layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <!-- Column A (Desktop Left): Debit Card -->
            <div class="order-2 lg:order-1 lg:col-span-1 h-full">
                <WalletDebitCard @balance-updated="handleBalanceUpdate" />
            </div>
            <!-- Column B (Desktop Right): KPI Cards stacked -->
            <div class="order-1 lg:order-2 flex flex-col gap-4 lg:col-span-1 h-full">
                <WalletKpiCards />
            </div>
        </div>
        <!-- Recent Transactions Table: full width below -->
        <div>
            <WalletRecentTransactions />
        </div>
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