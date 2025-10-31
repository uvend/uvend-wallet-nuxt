<template>
<Form class="flex flex-col gap-2 p-4">
        <div class="">
          <div class="flex flex-col gap-2">
            <Label for="name" class="text-sm">
              Meter Number
            </Label>
            <Input v-model="meterNumber" class="col-span-3" :disabled="isValid"/>
          </div>
        </div>
        <div v-if="isValid">
          <div class="gap-2">
            <Label for="name" class="text-sm">
              Name
            </Label>
            <Input v-model="meterName" class="col-span-3" />
          </div>
        </div>
        <div class="flex gap-2 justify-end">
            <Button @click="" :disabled="isLoading">
                Update
            </Button>
            <Button :disabled="isLoading" class="bg-red-600 hover:bg-red-600">
                Delete
            </Button>
        </div>
      </Form>
</template>
<script>
export default{
    props:{
        label: "Edit meter",
        dialogOpen: false,
    },
    data(){
        return {
            isValid: true,
            isLoading: false,
            meterNumber: null,
            meterName: null,
            meterId: null,
            isFavourite: null
        }
    },
    mounted(){
        console.log('log in edit meter',this.$store.selectedMeter)
        this.meterName = this.$store.selectedMeter.name;
        this.meterNumber = this.$store.selectedMeter.meterNumber;
        this.meterId = this.$store.selectedMeter.id;
    }
}
</script>
<style>
</style>