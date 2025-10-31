<template>
    <Card class="w-[450px] max-w-[90vw] bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
        <!-- Header with gradient background -->
        <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-6 text-white relative overflow-hidden">
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
                        <Icon name="lucide:user-plus" class="h-5 w-5 text-white"/>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">Create Account</h1>
                        <p class="text-sm text-white/90">Join us today</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Content area -->
        <CardContent class="p-6 space-y-4">
            <div class="space-y-2">
                <Label class="text-sm font-semibold text-gray-700">Email Address</Label>
                <Input 
                    type="email" 
                    v-model="email"
                    placeholder="you@example.com"
                    class="h-11"
                />
            </div>
            
            <div class="space-y-2">
                <Label class="text-sm font-semibold text-gray-700">Password</Label>
                <div class="relative">
                    <Input 
                        :type="showPassword ? 'text' : 'password'" 
                        v-model="password"
                        placeholder="••••••••"
                        class="h-11 pr-10"
                    />
                    <button
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="h-5 w-5"/>
                    </button>
                </div>
                <p class="text-xs text-gray-500">
                    Must be at least 8 characters with a mix of letters and numbers
                </p>
            </div>
        </CardContent>
        
        <CardFooter class="p-6 pt-0 flex flex-col gap-3">
            <Button 
                class="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200" 
                @click="debounceSignUp"
                :disabled="isLoading"
            >
                <Icon v-if="!isLoading" name="lucide:check" class="mr-2 h-4 w-4"/>
                <Icon v-else name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin"/>
                {{ isLoading ? 'Creating account...' : 'Create Account' }}
            </Button>
            
            <div class="relative my-2">
                <div class="absolute inset-0 flex items-center">
                    <span class="w-full border-t border-gray-200"></span>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-white px-2 text-gray-500">Or</span>
                </div>
            </div>
            
            <Button 
                class="w-full h-11" 
                variant="ghost" 
                @click="$emit('changeState')"
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
        return {
            email:null,
            password: null,
            invalid: [],
            isLoading: false,
            showPassword: false
        }
    },
    methods: {
        async signUp(){
            if(!this.valid()) return
            this.isLoading = true;
            try{
                const response = await useWalletAuthFetch(`${WALLET_API_URL}/auth/create`,{
                    method: "POST",
                    body : {
                        email : this.email,
                        password : this.password,
                        verification_callback_url: `${window.location.origin}/handler/email-verification`
                    }
                })
                const access_token = response.access_token;
                const refresh_token = response.refresh_token;
                localStorage.setItem('wallet-access-token',access_token);
                localStorage.setItem('wallet-refresh-token',refresh_token);
                return navigateTo('/');
            }catch(e){
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                });
            }finally{
                this.isLoading = false;
            }
        },
        valid(){
            this.invalid = []
            if(!this.email) this.invalid.push('email')
            if(!this.password) this.invalid.push('password')
            if(this.invalid.length > 0) return false
            return true
        }
    },
    created() {
        this.debounceSignUp = _.debounce(this.signUp, 300);
    }
}
</script>