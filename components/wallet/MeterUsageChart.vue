<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PieChart } from '@/components/ui/chart-pie'
import axios from 'axios'

interface MeterData {
  meterNumber: string
  consumption: number
  percentage: number
  utilityType: string
}

const meterData = ref<MeterData[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Sample data for testing
const sampleData = [
  { meterNumber: '14455895319', consumption: 100, percentage: 60, utilityType: 'Electricity' },
  { meterNumber: 'Other', consumption: 50, percentage: 40, utilityType: 'Electricity' },
]

async function fetchMeterData() {
  try {
    isLoading.value = true
    console.log('Fetching from:', `{{server}}/meter/14455895319`)
    
    const response = await axios.get(`{{server}}/meter/14455895319`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Raw API Response:', response)
    console.log('Response data:', response.data)

    if (response.data) {
      // For now, let's use sample data to test if the chart works
      meterData.value = sampleData
      
      // Once we confirm the chart works, we'll uncomment and adjust this:
      /*meterData.value = [{
        meterNumber: response.data.meterNumber || '14455895319',
        consumption: response.data.consumption || 0,
        percentage: response.data.percentage || 0,
        utilityType: response.data.utilityType || 'Electricity'
      }]*/
    }
  } catch (err: any) {
    console.error('Error details:', {
      message: err.message,
      response: err.response,
      status: err.response?.status,
      data: err.response?.data
    })
    error.value = `Failed to load meter data: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  console.log('Component mounted')
  fetchMeterData()
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
        @click="fetchMeterData" 
        class="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
    
    <div v-else class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">Meter Usage Distribution</h3>
        <button 
          @click="fetchMeterData" 
          class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>
      
      <PieChart
        v-if="meterData.length > 0"
        :data="meterData"
        value="percentage"
        label="meterNumber"
        :show-labels="true"
        :inner-radius="0.6"
      />
      <p v-else class="text-center text-gray-500">No meter data available</p>
      
      <!-- Debug info -->
      <div class="mt-4 p-4 bg-gray-50 rounded">
        <h4 class="font-medium mb-2">Debug Info:</h4>
        <pre class="text-xs overflow-auto">{{ JSON.stringify(meterData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template> 