<template>
    <div class="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 text-white relative overflow-hidden">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
            <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div class="relative z-10">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Icon name="lucide:filter" class="w-4 h-4 text-white"/>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-white">Filter Options</h3>
                        <p class="text-xs text-white/90">Select transaction type</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter Buttons -->
        <div class="p-4">
            <ScrollArea class="w-full">
                <div class="flex gap-3 w-full hide-scrollbar" style="overflow-x: auto;">
                    <Button 
                        v-for="data in modelValue" 
                        :key="data.key"
                        @click="setDateRange(data.key)"
                        :class="[
                            'flex-shrink-0 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105',
                            selectedOption === data.key 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                        ]"
                    >
                        <Icon 
                            :name="getIconForOption(data.key)" 
                            class="w-4 h-4 mr-2"
                            :class="selectedOption === data.key ? 'text-white' : 'text-gray-500'"
                        />
                        {{ data.value }}
                    </Button>
                </div>
            </ScrollArea>
            
            <!-- Selected Option Info -->
            <div v-if="selectedOption" class="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Icon :name="getIconForOption(selectedOption)" class="w-4 h-4 text-indigo-600"/>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-700">
                            Showing: {{ modelValue.find(item => item.key === selectedOption)?.value }}
                        </p>
                        <p class="text-xs text-gray-600">Filter applied to your transactions</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            selectedOption: null
        }
    },
    methods: {
        setDateRange(value) {
            this.selectedOption = value;
            this.$store.utilityType = value;
            console.log(value);
        },
        getIconForOption(key) {
            const iconMap = {
                'all': 'lucide:grid-3x3',
                'elect': 'lucide:zap',
                'water': 'lucide:droplet',
                'payments': 'lucide:credit-card',
                'gas': 'lucide:flame',
                'internet': 'lucide:wifi',
                'mobile': 'lucide:smartphone'
            };
            return iconMap[key] || 'lucide:circle';
        }
    },
    mounted() {
        // Set default selection to 'all' if available
        const allOption = this.modelValue.find(item => item.key === 'all');
        if (allOption) {
            this.selectedOption = 'all';
        }
    }
}
</script>