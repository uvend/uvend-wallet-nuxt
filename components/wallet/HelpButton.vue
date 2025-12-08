<template>
    <div>
        <button
            @click="showFaq = true"
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium text-sm"
        >
            <Icon name="lucide:help-circle" class="h-4 w-4"/>
            <span>Help</span>
        </button>
        <WalletFaqPopup v-model="showFaq" />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const showFaq = ref(false)
</script>

