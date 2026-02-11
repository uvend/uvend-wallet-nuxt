<template>
    <div class="grid grid-cols-2 gap-4">
        <!-- Daily Usage KPI -->
        <Card class="group relative overflow-hidden bg-gradient-to-br from-white to-orange-50/30 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                            <Icon name="lucide:activity" class="h-4 w-4 text-orange-600"/>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-600 uppercase tracking-wide">Daily Usage</p>
                        </div>
                    </div>
                    <div class="w-2 h-2 rounded-full bg-orange-500 shadow-sm"></div>
                </div>
                <div class="space-y-1">
                    <Skeleton class="w-24 h-8" v-if="isLoadingDailyUsage"/>
                    <p class="text-2xl font-bold text-orange-700" v-else>{{ formatUsage(dailyUsage) }}</p>
                </div>
            </div>
            <!-- Subtle gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-100/20 pointer-events-none"></div>
        </Card>

        <!-- Total Consumption KPI -->
        <Card class="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                            <Icon name="lucide:bar-chart" class="h-4 w-4 text-blue-600"/>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Consumption</p>
                        </div>
                    </div>
                    <div class="w-2 h-2 rounded-full bg-blue-500 shadow-sm"></div>
                </div>
                <div class="space-y-1">
                    <Skeleton class="w-24 h-8" v-if="isLoadingPeriodConsumption"/>
                    <p class="text-2xl font-bold text-blue-700" v-else>{{ formatUsage(periodConsumption) }}</p>
                </div>
            </div>
            <!-- Subtle gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-100/20 pointer-events-none"></div>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMetersStore } from '~/stores/meters'
import { fetchUatvendMeterAnalytics } from '~/composables/useUatvendMeterAnalytics'

const metersStore = useMetersStore()

const dailyUsage = ref(0)
const periodConsumption = ref(0)
const isLoadingDailyUsage = ref(true)
const isLoadingPeriodConsumption = ref(true)

function formatUsage(usage) {
    if (usage === 0 || !usage) return '0 kWh'
    // Format with kWh units (kilowatt-hours for electricity)
    // For large values, show in MWh (megawatt-hours)
    if (usage >= 1000000) {
        return `${(usage / 1000000).toFixed(2)} MWh`
    }
    // For values >= 1000, show in kWh with comma formatting
    if (usage >= 1000) {
        return `${(usage / 1000).toFixed(2)} kWh`
    }
    // For smaller values, show in Wh (watt-hours)
    return `${usage.toFixed(2)} Wh`
}

async function fetchKpiData() {
    if (!metersStore.isLoaded) {
        await metersStore.fetchMeters()
    }

    const meter = metersStore.meters?.[0]
    const identifiers = [
        meter?.meterNumber,
        meter?.meter_number,
        meter?.meterId,
        meter?.meter_id,
        meter?.id,
        meter?.meterNo,
        meter?.meter_no,
        meter?.serialNumber,
        meter?.serial_number,
    ]

    if (!identifiers.some((value) => value !== null && value !== undefined && String(value).trim())) {
        dailyUsage.value = 0
        periodConsumption.value = 0
        isLoadingDailyUsage.value = false
        isLoadingPeriodConsumption.value = false
        return
    }

    try {
        const response = await fetchUatvendMeterAnalytics(identifiers)
        if (!response) {
            dailyUsage.value = 0
            periodConsumption.value = 0
            return
        }
        const payload = response?.data || response || {}
        const dailyStats = Array.isArray(payload.dailyStats) ? payload.dailyStats : []
        const readings = Array.isArray(payload.readings) ? payload.readings : []

        // Daily usage from most recent daily stat
        const latestDaily = dailyStats[0] || null
        dailyUsage.value = Number(latestDaily?.total_kwh || 0)

        // Total consumption from highest cumulative reading
        const maxCumulative = readings.reduce((max, item) => {
            const value = Number(item?.cumulative_reading || 0)
            return Number.isNaN(value) ? max : Math.max(max, value)
        }, 0)
        periodConsumption.value = maxCumulative
    } catch (error) {
        console.error('KPI analytics error:', error)
        dailyUsage.value = 0
        periodConsumption.value = 0
    } finally {
        isLoadingDailyUsage.value = false
        isLoadingPeriodConsumption.value = false
    }
}

onMounted(() => {
    fetchKpiData()
})
</script>
