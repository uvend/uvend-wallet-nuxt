<template>
    <div 
        class="group relative bg-white rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        :class="{
            'ring-2 ring-orange-500/20 shadow-md': isOpen,
            'hover:border-orange-300/60': !isOpen
        }"
    >
        <!-- Gradient accent on hover -->
        <div class="absolute inset-0 bg-gradient-to-r from-orange-50/0 via-orange-50/0 to-orange-50/0 group-hover:from-orange-50/50 group-hover:via-orange-50/30 group-hover:to-orange-50/0 transition-all duration-300 pointer-events-none"></div>
        
        <button
            @click="toggle"
            class="relative w-full flex items-start justify-between py-5 px-6 text-left transition-all duration-200"
            :class="{
                'bg-gradient-to-r from-orange-50/50 to-transparent': isOpen
            }"
        >
            <div class="flex items-start gap-4 flex-1 pr-4">
                <!-- Question number badge -->
                <div 
                    class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs transition-all duration-300 mt-0.5"
                    :class="{
                        'bg-gradient-to-br from-orange-600 to-amber-700 text-white shadow-md': isOpen,
                        'bg-gray-100 text-gray-600 group-hover:bg-gray-200': !isOpen
                    }"
                >
                    <span v-if="index !== undefined">{{ index + 1 }}</span>
                    <Icon v-else name="lucide:help-circle" class="h-4 w-4"/>
                </div>
                
                <div class="flex-1">
                    <span 
                        class="font-semibold text-gray-900 leading-snug block transition-colors duration-200"
                        :class="{
                            'text-orange-900': isOpen
                        }"
                    >
                        {{ question }}
                    </span>
                </div>
            </div>
            
            <div 
                class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                :class="{
                    'bg-orange-100 text-orange-600 rotate-180': isOpen,
                    'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700': !isOpen
                }"
            >
                <Icon 
                    name="lucide:chevron-down" 
                    class="h-4 w-4 transition-transform duration-300"
                />
            </div>
        </button>
        
        <!-- Answer section with smooth animation -->
        <div
            v-show="isOpen"
            class="relative overflow-hidden"
        >
            <div 
                class="px-6 pb-6 pt-2 text-gray-700 text-[15px] leading-relaxed"
                :style="{
                    animation: 'slideDown 0.3s ease-out'
                }"
            >
                <div class="flex gap-4">
                    <div class="flex-shrink-0 w-8"></div>
                    <div class="flex-1 pl-4 border-l-2 border-orange-200/60 space-y-2">
                        <div v-if="answer" v-html="answer"></div>
                        <div v-else class="text-gray-400 italic flex items-center gap-2">
                            <Icon name="lucide:info" class="h-4 w-4"/>
                            <span>No answer provided yet.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        default: undefined
    }
})

const isOpen = ref(false)

function toggle() {
    isOpen.value = !isOpen.value
}
</script>

<style scoped>
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
        max-height: 0;
    }
    to {
        opacity: 1;
        transform: translateY(0);
        max-height: 500px;
    }
}
</style>

