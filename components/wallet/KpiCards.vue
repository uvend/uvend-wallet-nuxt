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
                    <div class="flex items-center gap-1">
                        <div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                        <p class="text-xs text-gray-600">From Kinetic Readings</p>
                    </div>
                </div>
            </div>
            <!-- Subtle gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-100/20 pointer-events-none"></div>
        </Card>

        <!-- Period Consumption KPI -->
        <Card class="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                            <Icon name="lucide:bar-chart" class="h-4 w-4 text-blue-600"/>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-600 uppercase tracking-wide">Period Consumption</p>
                        </div>
                    </div>
                    <div class="w-2 h-2 rounded-full bg-blue-500 shadow-sm"></div>
                </div>
                <div class="space-y-1">
                    <Skeleton class="w-24 h-8" v-if="isLoadingPeriodConsumption"/>
                    <p class="text-2xl font-bold text-blue-700" v-else>{{ formatUsage(periodConsumption) }}</p>
                    <div class="flex items-center gap-1">
                        <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <p class="text-xs text-gray-600">From Log Data</p>
                    </div>
                </div>
            </div>
            <!-- Subtle gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-100/20 pointer-events-none"></div>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMetersStore } from '~/stores/meters'

const metersStore = useMetersStore()
const m2mApi = useM2MApi()

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

/**
 * Get device serial from meter
 * Meters might have serial, deviceSerial, or meterNumber that maps to M2M device
 */
function getDeviceSerial(meter) {
    return meter.deviceSerial || meter.serial || meter.meterNumber || null
}

/**
 * Fetch daily usage from cumulative kinetic readings for all meters
 */
async function fetchDailyUsage() {
    isLoadingDailyUsage.value = true
    try {
        const meters = metersStore.meters || []
        if (meters.length === 0) {
            dailyUsage.value = 0
            return
        }

        let totalDailyUsage = 0
        const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

        // Fetch daily usage for each meter
        for (const meter of meters) {
            const deviceSerial = getDeviceSerial(meter)
            if (!deviceSerial) {
                console.warn(`No device serial found for meter: ${meter.meterNumber}`)
                continue
            }

            try {
                // Get daily usage for the last 30 days
                const dailyUsageData = await m2mApi.getDailyUsageBySerial(deviceSerial, 30)
                
                // Get today's usage (or most recent day)
                if (dailyUsageData && dailyUsageData.length > 0) {
                    // Find today's usage or use the most recent
                    const todayUsage = dailyUsageData.find(d => d.date === today)
                    const latestUsage = todayUsage || dailyUsageData[dailyUsageData.length - 1]
                    
                    if (latestUsage && latestUsage.usage) {
                        totalDailyUsage += latestUsage.usage
                    }
                }
            } catch (error) {
                console.error(`Error fetching daily usage for meter ${meter.meterNumber}:`, error)
                // Continue with other meters even if one fails
            }
        }

        dailyUsage.value = totalDailyUsage
    } catch (error) {
        console.error('Error fetching daily usage:', error)
        dailyUsage.value = 0
    } finally {
        isLoadingDailyUsage.value = false
    }
}

/**
 * Fetch period consumption from log data for all meters
 */
async function fetchPeriodConsumption() {
    isLoadingPeriodConsumption.value = true
    try {
        const meters = metersStore.meters || []
        if (meters.length === 0) {
            periodConsumption.value = 0
            return
        }

        let totalPeriodConsumption = 0

        // Fetch period consumption for each meter
        for (const meter of meters) {
            const deviceSerial = getDeviceSerial(meter)
            if (!deviceSerial) {
                console.warn(`No device serial found for meter: ${meter.meterNumber}`)
                continue
            }

            try {
                const periodData = await m2mApi.getPeriodConsumptionBySerial(deviceSerial)
                
                if (periodData) {
                    // Extract consumption value from period data
                    // The structure might vary, so we'll try common fields
                    const consumption = periodData.value || periodData.Value || 
                                      periodData.consumption || periodData.Consumption ||
                                      periodData.reading || periodData.Reading || 0
                    
                    totalPeriodConsumption += parseFloat(consumption) || 0
                }
            } catch (error) {
                console.error(`Error fetching period consumption for meter ${meter.meterNumber}:`, error)
                // Continue with other meters even if one fails
            }
        }

        periodConsumption.value = totalPeriodConsumption
    } catch (error) {
        console.error('Error fetching period consumption:', error)
        periodConsumption.value = 0
    } finally {
        isLoadingPeriodConsumption.value = false
    }
}

async function fetchKpiData() {
    // Ensure meters are loaded
    if (!metersStore.isLoaded) {
        await metersStore.fetchMeters()
    }
    
    // Fetch both daily usage and period consumption in parallel
    await Promise.all([
        fetchDailyUsage(),
        fetchPeriodConsumption()
    ])
}

onMounted(() => {
    fetchKpiData()
})
</script>
