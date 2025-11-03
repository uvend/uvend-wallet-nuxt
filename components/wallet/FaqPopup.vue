<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="p-0 max-w-3xl mx-auto bg-white border-0 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl">
            <div class="relative overflow-hidden rounded-3xl flex flex-col max-h-[90vh]">
                <!-- Header with gradient background -->
                <div class="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white flex-shrink-0 overflow-hidden">
                    <!-- Animated background elements -->
                    <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl animate-pulse"></div>
                    <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-xl"></div>
                    <div class="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    
                    <div class="relative z-10 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="relative">
                                <div class="absolute inset-0 bg-white/30 rounded-2xl blur-lg"></div>
                                <div class="relative w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-lg">
                                    <Icon name="lucide:help-circle" class="h-7 w-7 text-white"/>
                                </div>
                            </div>
                            <div>
                                <h3 class="text-2xl font-bold text-white mb-1 tracking-tight">Help Center</h3>
                                <p class="text-sm text-blue-100 font-medium">Frequently Asked Questions</p>
                            </div>
                        </div>
                        <div class="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                            <Icon name="lucide:sparkles" class="h-4 w-4 text-white"/>
                            <span class="text-xs font-medium text-white">{{ faqs.length }} Questions</span>
                        </div>
                    </div>
                </div>
                
                <!-- Scrollable content area -->
                <div class="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 via-white to-gray-50/50 p-6 sm:p-8">
                    <div class="space-y-4 max-w-4xl">
                        <WalletFaqItem
                            v-for="(faq, index) in faqs"
                            :key="index"
                            :question="faq.question"
                            :answer="faq.answer"
                            :index="index"
                        />
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue
})

watch(isOpen, (newValue) => {
    emits('update:modelValue', newValue)
})

// FAQ data - empty template for user to fill in
const faqs = ref([
    {
        question: 'Do I need mobile data or an internet connection to use the wallet?',
        answer: 'Yes, you do need an active internet connection (mobile data or Wi-Fi) to access and use the wallet.'
    },
    {
        question: 'Why can’t I log in even after entering my details?',
        answer: 'Please make sure that you’ve entered your email and password correctly. If you’re still unable to log in, feel free to contact our help desk for further assistance.'
    },
    {
        question: 'What happens if I add my banking details and make a payment, but my meter isn’t a Uvend meter?',
        answer: 'Before you can top up your wallet, you need to add a valid Uvend meter. When adding a meter, the system automatically validates it to confirm that it’s a Uvend meter. This ensures that your payments are always linked to the correct and supported meter.'
    }
])
</script>

