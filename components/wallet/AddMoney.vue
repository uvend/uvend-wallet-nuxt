<template>
    <WalletPayGate v-if="tab == 'paygate'" :pay_request_id="pay_requst_id" :checksum="checksum" @payment-complete="paymentComplete"/>
    <div v-if="tab == 'payment'" class="flex flex-col gap-2 p-4 overflow-y hide-scrollbar">
        <div class="flex flex-col gap-2" >
            <WalletCardBalance :addMoney="false"/>
                <NumberField id="amount" :min="0" v-model="amount" :format-options="{
                    minimumFractionDigits: 2,
                    }">
                    <Label for="amount">Amount</Label>
                    <NumberFieldContent>
                        <NumberFieldInput/>
                    </NumberFieldContent>
                </NumberField>
                <div class="flex justify-end">
                    <Button class="w-full" @click="addFunds">
                        Top Up Wallet
                    </Button>
                </div>
            <div v-if="cards.length > 0">
                <!-- hide until payvault enabled -->
            <!-- <Card v-for="card in cards" :key="card.id" class="flex justify-between p-2">
                <div class="font-bold flex items-center">
                    {{ card.payvault_data_1.slice(-4) }}
                </div>
                <Button @click="tab = 'cards'">
                    Change
                </Button>
            </Card>
            </div>
            <Button v-else>Add new card</Button> -->
            </div>
        </div>
    </div>
    <div v-if="tab == 'cards'">
        <WalletBankCards />
        <div class="flex gap-2 p-2">
            <Button @click="addCard">Add new card</Button>
            <Button @click="tab = 'payment'">Back</Button>
        </div>
    </div>
</template>
<script>
export default{
    data(){
        return {
            pay_requst_id: null,
            checksum: null,
            cards: null,
            selectedCard: null,
            tab: null,
            amount: 0.00
        }
    },
    methods:{
        async addCard(){
            const response = await useWalletAuthFetch(`${WALLET_API_URL}/pay/addCard`)
            this.pay_requst_id = response.PAY_REQUEST_ID
            this.checksum = response.CHECKSUM
            this.tab = 'paygate'
        },
        async getCards(primary = false){
            const response = await useWalletAuthFetch(`${WALLET_API_URL}/pay/card`,{
                params: {
                    primary: primary
                }
            })
            this.cards = response;
            this.cards.forEach(card => {
                if(card.primary){
                   // this.selectedCard = card
                }
            });
        },
        selectCard(id){
            console.log(id)
            this.selectedCard = id;
        },
        async addFunds(){
            if(!this.selectedCard && this.amount < 1) return;
            try{
                let url = `${WALLET_API_URL}/pay/addFunds`;
                if(this.selectedCard){
                    url = `${url}/${this.selectedCard}`
                }
                const response = await useWalletAuthFetch(url,{
                    method: "POST",
                    body: {
                        amount: this.amount
                    }
                })
                console.log(response)
                this.pay_requst_id = response.PAY_REQUEST_ID
                this.checksum = response.CHECKSUM
                this.tab = "paygate"
            }catch(error){
                console.log(error)
            }
        },
        paymentComplete(){
            this.amount = 0.00
            this.tab = 'payment'
            // TODO: emit success to reload parent
        }
    },
    mounted(){
        this.tab = 'payment';
        this.getCards();
    }
}
</script>
<style>
</style>