<template>
    <div class="group/item relative overflow-hidden bg-gradient-to-r rounded-xl border p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
         :class="[service.colors.bg, service.colors.border]">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300"
                     :class="service.colors.iconBg">
                    <Icon :name="service.icon" 
                          :class="['h-5 w-5', service.colors.iconColor]"/>
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-bold text-gray-900">{{ service.name }}</p>
                    <p class="text-xs text-gray-600 font-medium">{{ service.location }}</p>
                    <p class="text-xs text-gray-500 font-mono">{{ service.meterNumber }}</p>
                    <div class="flex items-center gap-1 mt-1">
                        <div class="w-1.5 h-1.5 rounded-full"
                             :class="service.colors.dotColor"></div>
                        <p class="text-xs font-semibold text-gray-700">Last: R {{ service.lastAmount.toFixed(2) }}</p>
                    </div>
                </div>
            </div>
            <Button 
                class="group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                @click="$emit('purchase', service.type)"
            >
                <span class="relative z-10 flex items-center gap-1">
                    <Icon name="lucide:shopping-cart" class="h-3 w-3"/>
                    Purchase
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </Button>
        </div>
        <!-- Subtle gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent pointer-events-none"
             :class="`to-${service.colors.bg.split('-')[1]}-100/20`"></div>
    </div>
</template>

<script setup>
defineProps({
    service: {
        type: Object,
        required: true
    }
})

defineEmits(['purchase'])
</script>
