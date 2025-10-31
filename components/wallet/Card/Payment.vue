<template>
    <Card class="p-4 card-grid items-center">
        <div class="flex flex-col gap-1">
            <div class="text-base font-semibold">
                {{ data.payvault_data_1 }}
            </div>
            <div class="flex items-center gap-2">
                <Badge :class="data.result_desc.toLowerCase() === 'auth done' ? 'bg-green-100 text-green-800 hover:bg-green-100/80' : 'bg-red-100 text-red-800 hover:bg-red-100/80'">
                    {{ data.result_desc.toLowerCase() === 'auth done' ? 'Successful' : data.result_desc }}
                </Badge>
            </div>
        </div>
        <div class="text-right font-black text-lg">
            R {{ formatAmount(data.amount) }}
        </div>
        <div class="text-right text-base font-semibold text-muted-foreground">
            {{ formattedDate(data.created) }}
        </div>
    </Card>
</template>
<script>
export default{
    props: {
        data: Object
    },
    methods:{
        formattedDate(dateString){
            const date = new Date(dateString);
            const options = { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('en-ZA', options);
        },
        formatAmount(amount){
            return (parseFloat(amount) / 100).toFixed(2);
        }
    }
}
</script>
<style>
.card-grid{
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 1rem;
}
</style>