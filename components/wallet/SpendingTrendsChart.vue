<template>
        <Card class="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
                <div>
                    <CardTitle class="text-lg font-semibold text-gray-800">Usage Trends</CardTitle>
                    <CardDescription class="text-sm">Daily consumption trends</CardDescription>
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
            <div v-if="isChartLoading" class="py-8 flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
                                     <div v-else-if="chartData.length === 0" class="py-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="lucide:bar-chart-3" class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-gray-600 font-medium">No usage data available</p>
                <p class="text-gray-400 text-sm mt-1">Usage logs will appear here when available</p>
            </div>
            <div v-else class="w-full">
                <apexchart
                    type="line"
                    height="300"
                    :options="chartOptions"
                    :series="chartSeries"
                />
            </div>
        </CardContent>
    </Card>
</template>

<script>
import { useM2MApi } from '~/composables/useM2MApi'

export default {
    name: 'UsageTrendsChart',
    props: {
        meters: {
            type: Array,
            default: () => []
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            usageData: [],
            isUsageLoading: false
        }
    },
    computed: {
        chartData() {
            return this.usageData || [];
        },
        chartSeries() {
            if (this.chartData.length === 0) return [];
            
            return [
                {
                    name: 'Electricity',
                    data: this.chartData.map(day => day.electricity),
                    color: '#f97316' // Orange-500
                },
                {
                    name: 'Water',
                    data: this.chartData.map(day => day.water),
                    color: '#3b82f6' // Blue-500
                }
            ];
        },
        
        chartOptions() {
            return {
                chart: {
                    type: 'line',
                    height: 300,
                    toolbar: {
                        show: true,
                        autoSelected: 'pan',
                        tools: {
                            download: true,
                            selection: false,
                            zoom: false,
                            zoomin: false,
                            zoomout: false,
                            pan: true,
                            reset: false
                        }
                    },
                    zoom: {
                        enabled: false
                    },
                    pan: {
                        enabled: true,
                        type: 'x'
                    },
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800
                    }
                },
                stroke: {
                    curve: 'smooth',
                    width: 4
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'vertical',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#fbbf24', '#60a5fa'],
                        inverseColors: false,
                        opacityFrom: 0.3,
                        opacityTo: 0.1,
                        stops: [0, 100]
                    }
                },
                markers: {
                    size: 5,
                    strokeWidth: 3,
                    strokeColors: ['#f97316', '#3b82f6'],
                    fillColors: ['#f97316', '#3b82f6'],
                    hover: {
                        size: 7
                    }
                },
                                                 xaxis: {
                    type: 'datetime',
                    categories: this.chartData.map(day => day.x),
                    labels: {
                        format: 'MMM dd',
                        style: {
                            fontSize: '12px',
                            colors: '#6b7280'
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
                        formatter: (value) => `${value.toFixed(0)} kWh`,
                        style: {
                            fontSize: '12px',
                            colors: '#6b7280'
                        }
                    },
                    axisBorder: {
                        show: false
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
                legend: {
                    show: false
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    x: {
                        format: 'MMM dd, yyyy'
                    },
                    y: {
                        formatter: (value, { seriesIndex }) => {
                            const seriesName = seriesIndex === 0 ? 'Electricity' : 'Water';
                            return `${value.toFixed(2)} kWh`;
                        }
                    },
                    style: {
                        fontSize: '12px'
                    }
                },
                responsive: [
                    {
                        breakpoint: 1024,
                        options: {
                            chart: {
                                toolbar: {
                                    show: false
                                },
                                zoom: {
                                    enabled: false
                                },
                                pan: {
                                    enabled: true,
                                    type: 'x'
                                }
                            },
                            markers: {
                                size: 4
                            },
                            stroke: {
                                width: 3
                            }
                        }
                    },
                    {
                        breakpoint: 640,
                        options: {
                            chart: {
                                height: 250,
                                toolbar: {
                                    show: false
                                },
                                zoom: {
                                    enabled: false
                                },
                                pan: {
                                    enabled: true,
                                    type: 'x'
                                }
                            },
                            xaxis: {
                                labels: {
                                    style: {
                                        fontSize: '10px'
                                    }
                                }
                            },
                            yaxis: {
                                labels: {
                                    style: {
                                        fontSize: '10px'
                                    }
                                }
                            }
                        }
                    }
                ]
            };
        },
        isChartLoading() {
            return this.isLoading || this.isUsageLoading;
        }
    },
    watch: {
        meters: {
            handler(newMeters) {
                this.loadUsageTrends(newMeters);
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        async loadUsageTrends(meters = []) {
            if (!Array.isArray(meters) || meters.length === 0) {
                this.usageData = [];
                this.isUsageLoading = false;
                return;
            }
            
            this.isUsageLoading = true;
            const usageByDate = {};
            const m2mApi = useM2MApi();
            
            await Promise.all(
                meters.map(async (meter) => {
                    const serial = this.getDeviceSerial(meter);
                    if (!serial) return;
                    const utilityType = (meter?.utilityType || 'electricity').toLowerCase();
                    try {
                        const logs = await m2mApi.getDeviceLogsBySerial(serial, { utilityType });
                        this.processLogs(logs, utilityType, usageByDate);
                    } catch (error) {
                        console.error(`Error fetching usage logs for meter ${meter?.meterNumber || serial}:`, error);
                    }
                })
            );
            
            this.usageData = Object.values(usageByDate)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(day => ({
                    x: day.date,
                    electricity: parseFloat(day.electricity.toFixed(2)),
                    water: parseFloat(day.water.toFixed(2))
                }));
            this.isUsageLoading = false;
        },
        getDeviceSerial(meter) {
            return meter?.deviceSerial || meter?.serial || meter?.meterNumber || null;
        },
        processLogs(logs, utilityType, usageByDate) {
            if (!Array.isArray(logs)) return;
            logs.forEach((log) => {
                const entries = log?.entries || log?.readings || [];
                entries.forEach((entry) => {
                    const date = this.safeDate(entry?.timestamp || entry?.time || entry?.created || log?.timestamp || log?.created);
                    if (!date) return;
                    const dateKey = date.toISOString().split('T')[0];
                    const value = parseFloat(
                        entry?.value ??
                        entry?.Value ??
                        entry?.reading ??
                        entry?.Reading ??
                        log?.value ??
                        log?.reading ??
                        0
                    );
                    if (isNaN(value)) return;
                    
                    if (!usageByDate[dateKey]) {
                        usageByDate[dateKey] = { date: dateKey, electricity: 0, water: 0 };
                    }
                    if (utilityType === 'water') {
                        usageByDate[dateKey].water += value;
                    } else {
                        usageByDate[dateKey].electricity += value;
                    }
                });
            });
        },
        safeDate(value) {
            if (!value) return null;
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return null;
            }
            return date;
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
