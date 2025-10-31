<template>
    <div class="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden group cursor-pointer transform hover:scale-105">
        <!-- Meter Card Header -->
        <div class="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 p-6 text-white relative overflow-hidden">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
            <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div class="relative z-10">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <Icon :name="getServiceIcon(meter.utilityType || 'all')" class="w-5 h-5 text-white"/>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-white">{{ meter.name }}</h4>
                            <p class="text-sm text-white/90">{{ meter.meterNumber }}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-white/80 uppercase tracking-wide">Meter</p>
                        <div class="w-2 h-2 rounded-full bg-green-400 mt-1"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Meter Card Content -->
        <div class="p-6">
            <div class="space-y-4">
                <!-- Service Type -->
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon :name="getServiceIcon(meter.utilityType || 'all')" class="w-4 h-4 text-blue-600"/>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-700">Service Type</p>
                        <p class="text-sm font-semibold text-gray-900 capitalize">{{ meter.utilityType || 'General' }}</p>
                    </div>
                </div>
                
                <!-- Status -->
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:check-circle" class="w-4 h-4 text-green-600"/>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-700">Status</p>
                        <p class="text-sm font-semibold text-green-600">Active</p>
                    </div>
                </div>
            </div>
            
            <!-- Click Indicator -->
            <div class="mt-6 flex items-center justify-center">
                <div class="flex items-center gap-2 text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                    <Icon v-if="open" name="lucide:chevron-down" class="w-4 h-4"/>
                    <Icon v-else name="lucide:chevron-right" class="w-4 h-4"/>
                    <span class="text-sm font-medium">{{ open ? 'Hide Details' : 'View Details' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    props: {
        meter: Object,
        open: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getServiceIcon(serviceType) {
            const iconMap = {
                'electricity': 'lucide:zap',
                'elect': 'lucide:zap',
                'water': 'lucide:droplet',
                'all': 'lucide:grid-3x3',
                'gas': 'lucide:flame',
                'internet': 'lucide:wifi',
                'mobile': 'lucide:smartphone'
            };
            return iconMap[serviceType?.toLowerCase()] || 'lucide:home';
        }
    }
}
</script>
<style>
</style>