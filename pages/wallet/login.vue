<template>
    <div class="w-full h-[100vh] flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-orange-50 p-4">
        <WalletSignin v-if="login && !resetPassword" @changeState="signUp(false)" @forgotPassword="toggleResetPassword()"/>
        <WalletSignup v-if="!login && !resetPassword" @changeState="signUp(true)"/>
        <WalletForgotPassword v-if="resetPassword" @backToLogin="toggleResetPassword()"/>
    </div>
</template>
<script>
definePageMeta({
    layout: 'noauth'
})
export default{
    data(){
        return{
            login: true,
            resetPassword: false
        }
    },
    methods:{
        signUp(state){
            this.login = state
        },
        toggleResetPassword(){
            this.resetPassword = !this.resetPassword
        },
        isAlreadyLoggedin(){
            if(localStorage.getItem('wallet-access-token')) return navigateTo("/");
        }
    },
    mounted(){
        this.isAlreadyLoggedin();
    }
}
</script>