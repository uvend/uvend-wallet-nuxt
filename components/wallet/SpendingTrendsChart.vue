<template>
  <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="text-lg font-semibold text-gray-800">Spending Trends</CardTitle>
          <CardDescription class="text-sm">Spending trends over time</CardDescription>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <div class="flex items-center gap-1">
            <div class="w-3 h-3 rounded-full bg-orange-500"></div>
            <span class="text-gray-600">Electricity</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <span class="text-gray-600">Water</span>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent class="p-4 sm:p-6">
      <div v-if="isLoading" class="py-8 flex justify-center text-sm text-gray-600">
        Loading...
      </div>
      <div v-else-if="chartData.length === 0" class="py-8 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="lucide:line-chart" class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-600 font-medium">No spending data available</p>
        <p class="text-gray-400 text-sm mt-1">Transactions will appear here when they occur</p>
      </div>
      <div v-else class="w-full h-[300px]">
        <LineChart
          :data="chartData"
          index="date"
          :categories="['Electricity', 'Water']"
          :colors="['#f97316', '#3b82f6']"
          :show-legend="false"
          :x-formatter="formatXTick"
          :y-formatter="formatYTick"
          class="h-[300px]"
        />
      </div>
    </CardContent>
  </Card>
</template>

<script>
import { LineChart } from '@/components/ui/chart-line'

export default {
  name: 'SpendingTrendsChart',
  components: {
    LineChart,
  },
  props: {
    transactions: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    chartData() {
      if (!this.transactions || this.transactions.length === 0) return []

      const groupedByDate = {}

      this.transactions.forEach((transaction) => {
        let date
        try {
          date = new Date(transaction.created)
          if (isNaN(date.getTime())) return
        } catch {
          return
        }

        const dateKey = date.toISOString().split('T')[0]

        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = {
            date: dateKey,
            Electricity: 0,
            Water: 0,
          }
        }

        if (transaction.utilityType === 'Electricity') {
          groupedByDate[dateKey].Electricity += parseFloat(transaction.amount || 0)
        } else if (transaction.utilityType === 'Water') {
          groupedByDate[dateKey].Water += parseFloat(transaction.amount || 0)
        }
      })

      return Object.values(groupedByDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((day) => ({
          date: day.date,
          Electricity: parseFloat(day.Electricity.toFixed(2)),
          Water: parseFloat(day.Water.toFixed(2)),
        }))
    },
  },
  methods: {
    formatXTick(tick) {
      const dateValue = this.chartData[tick]?.date
      if (!dateValue) return ''
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return String(dateValue)
      return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })
    },
    formatYTick(value) {
      return useWalletCurrencyStore().formatValue(value, { maximumFractionDigits: 0 })
    },
  },
}
</script>
