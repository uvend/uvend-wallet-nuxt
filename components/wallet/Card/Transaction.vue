<template>
    <Card class="p-4 hover:bg-gray-50 transition-colors" @click="togglePopup">
        <div class="card-grid gap-4">
            <div class="space-y-1">
                <p class="text-base font-semibold text-muted-foreground">Meter Number</p>
                <p class="font-black text-lg">{{ data.meterNumber }}</p>
            </div>
            <div class="space-y-1">
                <p class="text-base font-semibold">Token</p>
                <p class="font-black text-lg">{{ vendToken }}</p>
            </div>
            <div class="text-right space-y-1">
                <p class="text-base font-semibold text-muted-foreground">Amount</p>
                <p class="font-black text-lg">R {{ formatAmount(data.amount) }}</p>
            </div>
            <div class="text-right space-y-1">
                <p class="text-base font-semibold text-muted-foreground">Type</p>
                <p class="font-black text-lg">{{ formatUtilityType(data.utilityType) }}</p>
            </div>
            <div class="text-right space-y-1">
                <p class="text-base font-semibold text-muted-foreground">Date</p>
                <p class="font-black text-lg">{{ formattedDate(data.created) }}</p>
            </div>
        </div>
    </Card>
    <!-- <WalletPopup v-model="isOpen" :hasButton="false">
        <p v-for="token in data.vendResponse.listOfTokenTransactions" class="text-center h-full flex items-center justify-center text-xl">
            <div v-for="tokens in token.tokens">
                <span v-for="keys in tokens.tokenKeys">
                    <span>{{ keys }} &nbsp;</span>
                </span>
            </div>
        </p>
    </WalletPopup> -->
</template>
<script>
export default{
    props: {
        data: Object
    },
    data(){
        return{
            isOpen: false
        }
    },
    mounted(){
        console.log(this.data)
    },
    methods:{
        formattedDate(dateString){
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${day}-${month}-${year} ${hours}:${minutes}`;
        },
        formatAmount(amount) {
            return parseFloat(amount).toFixed(2);
        },
        formatUtilityType(type) {
            const types = {
                'elect': 'Electricity',
                'water': 'Water',
                'gas': 'Gas'
            };
            return types[type] || type;
        },
        togglePopup(){
            this.isOpen = !this.isOpen;
        }
    },
    computed:{
        vendToken(){
            if(this.data.vendResponse){
                console.log(this.data.vendResponse)
                var vendResponse = JSON.parse(this.data.vendResponse)
                var tokenKeys = vendResponse.listOfTokenTransactions[0].tokens[0].tokenKeys
                return tokenKeys.join('-')
            }
            return 'Unknown'
        }
    }
}
</script>
<style scoped>
.card-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr;
    align-items: center;
}

@media (max-width: 768px) {
    .card-grid {
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
}

@media (max-width: 640px) {
    .card-grid {
        grid-template-columns: 1fr;
    }
    
    .card-grid > div {
        text-align: left !important;
    }
}
</style>