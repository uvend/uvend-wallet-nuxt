<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { BarChart } from '@/components/ui/chart-bar'
import axios from 'axios'

interface MeterVending {
  meterNumber: string
  amount: number
  utilityType: string
  date: string
}

interface ChartDataItem {
  meter: string
  vending: number
  utility: string
}

const vendingData = ref<MeterVending[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Sample data for testing
const sampleData = [
  { meterNumber: '14455895319', amount: 1000, utilityType: 'Electricity', date: '2024-03-01' },
  { meterNumber: '14455895320', amount: 750, utilityType: 'Electricity', date: '2024-03-01' },
  { meterNumber: '14455895321', amount: 1200, utilityType: 'Electricity', date: '2024-03-01' },
]

const chartData = computed<ChartDataItem[]>(() => {
  return vendingData.value.map(item => ({
    meter: item.meterNumber,
    vending: item.amount,
    utility: item.utilityType
  }))
})

// Define the categories array with the correct type
const categories: Array<keyof ChartDataItem> = ['vending']
const colors = ['#2563eb'] // blue-600

async function fetchVendingData() {
  try {
    isLoading.value = true
    console.log('Fetching meter data...')
    
    const response = await axios.get(`{{server}}/meter/14455895319`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    console.log('API Response:', response.data)

    if (response.data) {
      // For now, using sample data to test the chart
      vendingData.value = sampleData
    }
  } catch (err: any) {
    console.error('Error details:', {
      message: err.message,
      response: err.response,
      status: err.response?.status,
      data: err.response?.data
    })
    error.value = `Failed to load vending data: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

function formatAmount(tick: number | Date): string {
  if (typeof tick === 'number') {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(tick)
  }
  return ''
}

onMounted(() => {
  console.log('Component mounted')
  fetchVendingData()
})
</script>

<template>
  <div class="w-full">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="text-red-500 text-center h-64 flex items-center justify-center">
      {{ error }}
      <button 
        @click="fetchVendingData" 
        class="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
    
    <div v-else class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">Meter Vending Distribution</h3>
        <button 
          @click="fetchVendingData" 
          class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>
      
      <BarChart
        v-if="chartData.length > 0"
        :data="chartData"
        :categories="categories"
        index="meter"
        :colors="colors"
        type="grouped"
        :rounded-corners="4"
        :y-formatter="formatAmount"
        :show-legend="false"
      />
      <p v-else class="text-center text-gray-500">No vending data available</p>
      
      <!-- Debug info -->
      <div class="mt-4 p-4 bg-gray-50 rounded">
        <h4 class="font-medium mb-2">Debug Info:</h4>
        <pre class="text-xs overflow-auto">{{ JSON.stringify(chartData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template> 