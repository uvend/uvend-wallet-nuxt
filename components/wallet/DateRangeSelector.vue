<template>
    <ScrollArea class="flex gap-2 w-full md:w-auto h-fit">
        <div class="flex gap-2">
            <Button v-for="date in dateRangeOptions" size="sm" variant="outline" class="flex-1 sm:flex-none bg-white" @click="setDateRange(date.key)">{{ date.value }}</Button>
        </div>
      </ScrollArea>
</template>
<script>
export default{
    data(){
        return {
            dateRangeOptions: [
                { key : "7days", value : "7 days"},
                { key : "30days", value : "30 days"},
                { key : "6months", value : "6 months"},
                { key : "12months", value : "12 months"}
            ],
            selectedRange: "7days"
        }
    },
    methods: {
        setDateRange(value){
            this.$store.dateRange = value
        }
    },
    mounted(){
        this.$store.dateRange = this.dateRangeOptions[0].key
    }
}
</script>