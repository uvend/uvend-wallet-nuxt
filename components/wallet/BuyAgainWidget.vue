<template>
    <Card class="group  h-full relative overflow-hidden bg-gradient-to-br from-white to-purple-50/20 border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
        <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                    <Icon name="lucide:repeat" class="h-4 w-4 text-purple-600"/>
                </div>
                <CardTitle class="text-lg font-bold text-gray-900">Buy Again</CardTitle>
            </div>
        </CardHeader>
        <CardContent class="space-y-4 ">
            <BuyAgainItem 
                v-for="item in recentPurchases" 
                :key="item.id"
                :service="item"
                @purchase="handlePurchase"
            />
        </CardContent>
    </Card>
</template>

<script setup>
import { ref } from 'vue'
import BuyAgainItem from './BuyAgainItem.vue'

// Sample data - in real app, this would come from API
const recentPurchases = ref([
    {
        id: 1,
        type: 'electricity',
        name: 'Electricity',
        location: 'Main House',
        meterNumber: 'ELE-123456789',
        lastAmount: 150.00,
        icon: 'lucide:zap',
        colors: {
            bg: 'from-yellow-50 to-orange-50',
            border: 'border-yellow-200/50',
            iconBg: 'from-yellow-100 to-orange-100',
            iconColor: 'text-yellow-600',
            dotColor: 'bg-yellow-400'
        }
    },
    {
        id: 2,
        type: 'water',
        name: 'Water',
        location: 'Main House',
        meterNumber: 'WAT-111222333',
        lastAmount: 85.50,
        icon: 'lucide:droplet',
        colors: {
            bg: 'from-blue-50 to-cyan-50',
            border: 'border-blue-200/50',
            iconBg: 'from-blue-100 to-cyan-100',
            iconColor: 'text-blue-600',
            dotColor: 'bg-blue-400'
        }
    }
])

function handlePurchase(type) {
    // Navigate to payments screen with utility type
    navigateTo(`/wallet/payments?utility=${type}`)
}
</script>
