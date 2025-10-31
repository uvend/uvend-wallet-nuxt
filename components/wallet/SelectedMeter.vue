<template>
    <div class="flex justify-between -mt-4 mb-7">
        <Button @click="$emit('deselect')" variant="secondary">
            <Icon name="lucide:arrow-left" class="h-4 w-4"/>
        </Button>
        <WalletPopup buttonLabel="Edit Meter" @click="console.log(meter)">
          <WalletEditMeter />
        </WalletPopup>
    </div>
    <WalletCardMeter :meter="meter" @click="$emit('deselect')" open="true"/>
    <!-- meter consumption graph -->

     <!-- meter transacition history-->
</template>
<script>
export default{
    props:{
        meter: Object,
    },
    mounted(){
        this.$store.selectedMeter = this.meter
    }
}
</script>
<style>
</style>