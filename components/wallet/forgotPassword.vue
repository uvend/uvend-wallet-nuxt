<template>
    <Card class="w-[450px] max-w-[90vw] bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
        <!-- Header with gradient background -->
        <div class="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 p-6 text-white relative overflow-hidden">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div class="relative z-10">
                <!-- UVend Logo -->
                <div class="flex items-center gap-3 mb-6">
                    <h1 class="text-white font-bold text-2xl leading-tight tracking-wide" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        U-Vend
                    </h1>
                    <div class="text-orange-400 font-semibold text-xs leading-tight tracking-wider">
                        <div>PREPAID</div>
                        <div>UTILITIES</div>
                        <div>MANAGEMENT</div>
                    </div>
                </div>
                
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Icon name="lucide:lock" class="h-5 w-5 text-white"/>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">Reset Password</h1>
                        <p class="text-sm text-white/90">We'll send you a reset link</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Content area -->
        <CardContent class="p-6">
            <div class="space-y-4">
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <Icon name="lucide:mail" class="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5"/>
                        <p class="text-sm text-gray-700">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <Label class="text-sm font-semibold text-gray-700">Email Address</Label>
                    <Input 
                        type="email" 
                        v-model="email"
                        placeholder="you@example.com"
                        class="h-11"
                    />
                </div>
            </div>
        </CardContent>
        
        <CardFooter class="p-6 pt-0 flex flex-col gap-3">
            <Button 
                class="w-full h-11 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold shadow-lg shadow-orange-500/30 transition-all duration-200" 
                @click="resetPassword"
                :disabled="isLoading"
            >
                <Icon v-if="!isLoading" name="lucide:send" class="mr-2 h-4 w-4"/>
                <Icon v-else name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin"/>
                {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
            </Button>
            
            <Button 
                class="w-full h-11" 
                variant="ghost" 
                @click="$emit('backToLogin')"
            >
                <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4"/>
                Back to login
            </Button>
        </CardFooter>
    </Card>
</template>
<script>
import _ from 'lodash';
export default{
    data(){
        return{
            email: null,
            isLoading: false
        }
    },
    created() {
        this.debounceResetPassword = _.debounce(this.resetPassword, 300);
    },
    methods:{
        async resetPassword(){
            if(!this.email) {
                this.$toast({
                    title: 'Email Required',
                    description: 'Please enter your email address.',
                    variant: "destructive"
                });
                return;
            }
            this.isLoading = true;
            try{
                await useWalletAuthFetch(`/auth/send-reset-code`,{
                    method : "POST",
                    body: {
                        email : this.email,
                        callback_url: `${window.location.origin}/handler/reset-password`
                    }
                })
                this.$toast({
                    title: 'Email Sent!',
                    description: 'If an account exists with this email, you will receive password reset instructions.',
                    variant: "success"
                });
                this.email = null;
            }catch(e){
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                });
            }finally{
                this.isLoading = false;
            }
        }
    }
}
</script>