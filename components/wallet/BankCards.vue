<template>
    <div class="flex flex-col gap-2 p-2">
        <Card v-for="card in cards" :key="card.id" class="flex justify-between p-2">
            <div class="font-bold flex items-center">
                {{ card.payvault_data_1.slice(-4) }}
            </div>
            <Button @click="$emit('buttonAction')" :variant="!card.primary ? 'secondary' : ''">
                Primary
            </Button>
        </Card>
    </div>
</template>
<script>
export default{
    props: {
        cards: Array
    },
    data(){
        return {
            cards: null
        }
    },
    methods:{
        async getCards(primary = false){
            const response = await useWalletAuthFetch(`/pay/card`,{
                params: {
                    primary: primary
                }
            })
            this.cards = response;
        },
    },
    mounted(){
        this.getCards()
    }
}
</script>