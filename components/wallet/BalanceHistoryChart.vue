<template>
    <Card class="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
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
            <div v-else-if="chartData.length > 0" class="w-full">
                <!-- ApexCharts Container -->
                <div id="balance-history-chart" class="w-full h-[300px]"></div>
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
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue'
import ApexCharts from 'apexcharts'

const props = defineProps({
    transactions: {
        type: Array,
        default: () => []
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

const chart = ref(null)

const chartData = computed(() => {
    if (!props.transactions || props.transactions.length === 0) return []
    
    // Debug: Log the first transaction to see its structure
    if (props.transactions.length > 0) {
        console.log('First transaction structure:', props.transactions[0])
    }
    
    // Group transactions by date
    const groupedByDate = {}
    
    props.transactions.forEach(transaction => {
        const date = new Date(transaction.created)
        const dateKey = date.toISOString().split('T')[0]
        
        if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = {
                date: dateKey,
                deposits: 0
            }
        }
        
        const amount = parseFloat(transaction.amount/100)
        
        // Debug: Log transaction details
        
        
        
            groupedByDate[dateKey].deposits += amount
    })
    
    // Convert to array and sort by date
    const chartData = Object.values(groupedByDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(day => ({
            label: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            deposits: day.deposits.toFixed(2),
            date: day.date
        }))
    
    // Show last 7 days for better readability
    const finalData = chartData.slice(-7)
    console.log('Final chart data:', finalData)
    return finalData
})

const initializeChart = () => {
    if (chartData.value.length === 0) return
    
    const chartElement = document.querySelector("#balance-history-chart")
    if (!chartElement) return
    
    const options = {
        chart: {
            type: 'area',
            height: 300,
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        series: [
            {
                name: 'Deposits',
                data: chartData.value.map(day => parseFloat(day.deposits)),
                color: '#22c55e'
            }
        ],
        xaxis: {
            categories: chartData.value.map(day => day.label),
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                },
                formatter: function (value) {
                    return 'R' + value.toFixed(0)
                }
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        markers: {
            size: 4,
            strokeWidth: 2,
            strokeColors: ['#22c55e'],
            fillColors: ['#22c55e'],
            hover: {
                size: 6
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontSize: '12px'
            },
            y: {
                formatter: function (value, { seriesIndex }) {
                    return 'R' + value.toFixed(2)
                }
            }
        },
        legend: {
            show: false
        }
    }

    if (chart.value) {
        chart.value.destroy()
    }

    nextTick(() => {
        chart.value = new ApexCharts(chartElement, options)
        chart.value.render()
    })
}

onMounted(() => {
    nextTick(() => {
        initializeChart()
    })
})

onBeforeUnmount(() => {
    if (chart.value) {
        chart.value.destroy()
    }
})

watch(chartData, () => {
    nextTick(() => {
        initializeChart()
    })
}, { deep: true })
</script>
