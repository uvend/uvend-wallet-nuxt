<template>
    <div class="flex items-center justify-center gap-3">
        <img
            v-if="useAppLogo"
            src="/icons/IMG-20260902-WA0001-removebg-preview.png"
            alt="App logo"
            class="h-20 w-auto max-w-[240px] object-contain rounded-lg"
        />
        <template v-else>
            <h1 class="text-white font-bold text-2xl leading-tight tracking-wide" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                U-Vend
            </h1>
            <div class="text-orange-400 font-semibold text-xs leading-tight tracking-wider">
                <div>PREPAID</div>
                <div>UTILITIES</div>
                <div>MANAGEMENT</div>
            </div>
        </template>
    </div>
</template>
<script setup>
const { public: publicConfig } = useRuntimeConfig()
const useAppLogo = computed(() => {
    const value = publicConfig.useAppLogo
    return value === true || String(value).trim().toLowerCase() === 'true'
})
</script>
