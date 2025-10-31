<template>
    <div class="w-full h-[100vh] flex items-center justify-center">
        <MyLoader v-if="isLoading" />
        <WalletResetPassword v-else-if="isCodeValid" :code="code"/>
        <div v-else>
            invalid code
        </div>
    </div>
</template>
<script>
definePageMeta({
    layout: 'noauth'
})
export default{
    data(){
        return {
            code: null,
            isCodeValid: null,
            isLoading: null
        }
    },
    methods:{
        async validateCode(){
            try{
                this.isLoading = true;
                this.code = this.$route.query.code;
                const response = await useWalletAuthFetch(`${WALLET_API_URL}/auth/validate-reset-code`,{
                    method: "POST",
                    body: {
                        code: this.code
                    }
                })
                if(response.is_code_valid){
                    this.isCodeValid = true
                }
            }catch(e){
                console.log(e)
                this.isCodeValid = false
            }finally{
                this.isLoading = false;
            }
        }
    },
    async mounted(){
        await this.validateCode();
    }
}
</script>