<template>
  <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="text-lg font-semibold text-gray-800">Balance History</CardTitle>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <div class="flex items-center gap-1">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="text-gray-600">Deposits</span>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent class="p-4 sm:p-6">
      <div v-if="isLoading" class="py-8 flex justify-center">
        <MyLoader />
      </div>
      <div v-else-if="chartData.length > 0" class="w-full h-[300px]">
        <LineChart
          :data="chartData"
          index="date"
          :categories="['Deposits']"
          :colors="['#22c55e']"
          :show-legend="false"
          :x-formatter="formatXTick"
          :y-formatter="formatYTick"
          class="h-[300px]"
        />
      </div>
      <div v-else class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="lucide:trending-up" class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-600 font-medium">No balance data available</p>
        <p class="text-xs text-gray-400 mt-1">Chart will appear when balance changes occur</p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { LineChart } from '@/components/ui/chart-line'
import { useWalletCurrencyStore } from '~/stores/walletCurrency'

const walletCurrency = useWalletCurrencyStore()

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const chartData = computed(() => {
  if (!props.transactions || props.transactions.length === 0) return []

  const groupedByDate = {}

  props.transactions.forEach((transaction) => {
    const date = new Date(transaction.created)
    if (isNaN(date.getTime())) return
    const dateKey = date.toISOString().split('T')[0]

    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = {
        date: dateKey,
        Deposits: 0,
      }
    }

    groupedByDate[dateKey].Deposits += parseFloat(transaction.amount / 100) || 0
  })

  return Object.values(groupedByDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((day) => ({
      date: day.date,
      Deposits: Number(day.Deposits.toFixed(2)),
    }))
    .slice(-7)
})

function formatXTick(tick) {
  const dateValue = chartData.value[tick]?.date
  if (!dateValue) return ''
  const date = new Date(dateValue)
  if (isNaN(date.getTime())) return String(dateValue)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatYTick(value) {
  return walletCurrency.formatValue(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
</script>
