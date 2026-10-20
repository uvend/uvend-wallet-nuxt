<template>
    <div class="flex items-center justify-center gap-3">
        <div
            v-if="useAppLogo && brandLogo"
            class="relative h-24 w-[240px] max-w-full overflow-hidden"
        >
            <img
                :src="brandLogo"
                alt="App logo"
                class="absolute inset-0 h-full w-full object-cover object-center"
            />
        </div>
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
const brandLogo = computed(() => String(publicConfig.brandLogo || '').trim())
</script>
