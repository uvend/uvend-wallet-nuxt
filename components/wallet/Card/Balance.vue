<template>
    <Card class="p-4 bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 flex justify-between">
        <div class="flex flex-col">
            <p class="text-gray-600 text-base font-semibold flex items-center">
            <Icon name="lucide:shield" class="mr-1 h-4 w-4"/>Your Wallet Balance</p>
            <Skeleton class="w-16 h-9" v-if="isLoading"/>
            <p class="text-4xl font-black" v-else>{{Number($store.balance).toFixed(2)}}</p>
            <p class="text-base font-semibold text-gray-500"></p>
        </div>
        <div>
        <WalletPopup v-if="addMoney" buttonLabel="Top Up Wallet">
            <WalletAddMoney />
        </WalletPopup>
        </div>
    </Card>
</template>
<script>
export default{
    props: {
        addMoney: true 
    },
    data(){
        return {
            balance: null,
            isLoading: false,
        }
    },
    methods:{
        async getWalletBalance(){
            this.isLoading = true;
            const response = await useWalletAuthFetch(`/pay/balance`)
            this.$store.balance = Number(response.balance).toFixed(2);
            this.isLoading = false;
        }
    },
    mounted(){
        this.getWalletBalance();
    }
}
</script>
