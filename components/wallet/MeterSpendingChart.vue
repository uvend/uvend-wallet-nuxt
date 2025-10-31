<template>
    <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
                <div>
                    <CardTitle class="text-lg font-semibold text-gray-800">Spending Distribution</CardTitle>
                    <CardDescription class="text-sm">Electricity vs Water spending</CardDescription>
                </div>
                <div class="flex items-center gap-2 text-xs">
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
            <div v-if="isLoading" class="py-8 flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div v-else-if="chartData.length === 0" class="py-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="lucide:bar-chart-3" class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-gray-600 font-medium">No meter data available</p>
                <p class="text-gray-400 text-sm mt-1">Meter spending will appear here when transactions occur</p>
            </div>
            <div v-else class="w-full">
                <apexchart
                    type="pie"
                    height="300"
                    :options="chartOptions"
                    :series="chartSeries"
                />
            </div>
        </CardContent>
    </Card>
</template>

<script>
export default {
    name: 'MeterSpendingChart',
    props: {
        transactions: {
            type: Array,
            default: () => []
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        chartData() {
            if (!this.transactions || this.transactions.length === 0) return [];
            
            // Calculate total spending by utility type
            let electricityTotal = 0;
            let waterTotal = 0;
            
            this.transactions.forEach(transaction => {
                const utilityType = transaction.utilityType;
                const amount = parseFloat(transaction.amount || 0);
                
                if (utilityType === 'Electricity') {
                    electricityTotal += amount;
                } else if (utilityType === 'Water') {
                    waterTotal += amount;
                }
            });
            
            return [
                {
                    name: 'Electricity',
                    value: parseFloat(electricityTotal.toFixed(2)),
                    color: '#f97316'
                },
                {
                    name: 'Water',
                    value: parseFloat(waterTotal.toFixed(2)),
                    color: '#3b82f6'
                }
            ];
        },
        
        chartSeries() {
            if (this.chartData.length === 0) return [];
            
            return this.chartData.map(item => item.value);
        },
        
        chartOptions() {
            return {
                chart: {
                    type: 'pie',
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
                labels: this.chartData.map(item => item.name),
                colors: this.chartData.map(item => item.color),
                dataLabels: {
                    enabled: true,
                    formatter: (val, opts) => {
                        const value = opts.w.config.series[opts.seriesIndex];
                        const total = opts.w.config.series.reduce((sum, val) => sum + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${percentage}%`;
                    },
                    style: {
                        fontSize: '12px',
                        fontWeight: 'bold',
                        colors: ['#ffffff']
                    },
                    dropShadow: {
                        enabled: true,
                        color: '#000',
                        top: 1,
                        left: 1,
                        blur: 1,
                        opacity: 0.45
                    }
                },
                plotOptions: {
                    pie: {
                        expandOnClick: true,
                        donut: {
                            size: '60%',
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Total',
                                    formatter: () => {
                                        const total = this.chartData.reduce((sum, item) => sum + item.value, 0);
                                        return `R${total.toFixed(2)}`;
                                    },
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#374151'
                                },
                                value: {
                                    show: true,
                                    formatter: (val) => `R${val.toFixed(2)}`,
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    color: '#6b7280'
                                }
                            }
                        }
                    }
                },
                legend: {
                    show: true,
                    position: 'bottom',
                    horizontalAlign: 'center',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    labels: {
                        colors: '#6b7280',
                        useSeriesColors: false
                    },
                    markers: {
                        width: 8,
                        height: 8,
                        strokeWidth: 0,
                        radius: 2
                    }
                },
                tooltip: {
                    enabled: true,
                    y: {
                        formatter: (value, { seriesIndex }) => {
                            const item = this.chartData[seriesIndex];
                            const total = this.chartData.reduce((sum, item) => sum + item.value, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${item.name}: R${value.toFixed(2)} (${percentage}%)`;
                        }
                    },
                    style: {
                        fontSize: '12px'
                    }
                },
                responsive: [
                    {
                        breakpoint: 640,
                        options: {
                            chart: {
                                height: 250
                            },
                            plotOptions: {
                                pie: {
                                    donut: {
                                        size: '50%'
                                    }
                                }
                            },
                            legend: {
                                fontSize: '10px'
                            },
                            dataLabels: {
                                style: {
                                    fontSize: '10px'
                                }
                            }
                        }
                    }
                ]
            };
        }
    }
}
</script>

<style scoped>
/* Mobile-first responsive design */
@media (max-width: 640px) {
    .chart-container {
        height: 250px;
    }
}

/* Ensure proper chart rendering */
:deep(.apexcharts-canvas) {
    width: 100% !important;
}

:deep(.apexcharts-svg) {
    width: 100% !important;
}
</style>
