<template>
    <WalletPopup 
        v-model="localOpen" 
        :hasButton="false"
        title="Purchase Token"
        subtitle="Buy tokens for your meters"
        icon="lucide:zap"
    >
        <WalletBuyNow :selectedMeter="selectedMeter" />
    </WalletPopup>
</template>

<script>
export default {
    name: 'PurchaseTokenDialog',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        selectedMeter: {
            type: Object,
            default: null
        }
    },
    computed: {
        localOpen: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        }
    }
}
</script>
