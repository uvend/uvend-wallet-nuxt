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
                        <Icon name="lucide:log-in" class="h-5 w-5 text-white"/>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">Welcome Back</h1>
                        <p class="text-sm text-white/90">Sign in to your account</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Content area -->
        <CardContent class="p-6 space-y-4">
            <div class="space-y-2">
                <Label for="signin-email" class="text-sm font-semibold text-gray-700">Email Address</Label>
                <Input 
                    id="signin-email"
                    name="email"
                    type="email" 
                    v-model="email"
                    placeholder="you@example.com"
                    class="h-11"
                />
            </div>
            
            <div class="space-y-2">
                <Label for="signin-password" class="text-sm font-semibold text-gray-700">Password</Label>
                <div class="relative">
                    <Input 
                        id="signin-password"
                        name="password"
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
                <p class="text-sm text-orange-600 cursor-pointer hover:text-orange-700 transition-colors flex items-center gap-1" @click="$emit('forgotPassword')">
                    <Icon name="lucide:lock" class="h-3 w-3"/>
                    Forgot your password?
                </p>
            </div>
        </CardContent>
        
        <CardFooter class="p-6 pt-0 flex flex-col gap-3">
            <Button 
                class="w-full h-11 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold shadow-lg shadow-orange-500/30 transition-all duration-200" 
                @click="debounceSignIn"
                :disabled="isLoading"
            >
                <Icon v-if="!isLoading" name="lucide:arrow-right" class="mr-2 h-4 w-4"/>
                <Icon v-else name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin"/>
                {{ isLoading ? 'Signing in...' : 'Sign In' }}
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
                <Icon name="lucide:user-plus" class="mr-2 h-4 w-4"/>
                Create a new account
            </Button>
        </CardFooter>
    </Card>
</template>
<script>
import _ from 'lodash';
import { uatvendSignIn, setUatvendTokens } from '~/composables/useUatvendAuthFetch'
export default{
    data(){
        return {
            email : null,
            password: null,
            invalid: [],
            isLoading: false,
            showPassword: false
        }
    },
    mounted(){
        const config = useRuntimeConfig();
        console.log(config.public.walletApiUrl);
    },
    methods:{
        async signIn(){
            if(!this.valid()) return
            this.isLoading = true;
            try{
                // Trim and validate inputs
                const email = this.email?.trim();
                const password = this.password?.trim();
                
                if (!email || !password) {
                    this.$toast({
                        title: 'Validation Error',
                        description: 'Please enter both email and password',
                        variant: "destructive"
                    });
                    this.isLoading = false;
                    return;
                }
                
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    this.$toast({
                        title: 'Validation Error',
                        description: 'Please enter a valid email address',
                        variant: "destructive"
                    });
                    this.isLoading = false;
                    return;
                }
                
                // Prepare request body
                const requestBody = {
                    email: email,
                    password: password
                };
                
                console.log('Sign-in request body:', requestBody);
                
                const response = await useWalletAuthFetch(`/auth/sign-in`,{
                    method: "POST",
                    body: requestBody
                });
                if(!response.access_token){
                    throw new Error(response)
                }
                const access_token = response.access_token;
                const refresh_token = response.refresh_token;
                localStorage.setItem('wallet-access-token',access_token);
                localStorage.setItem('wallet-refresh-token',refresh_token);
                
                // Fetch meters immediately after successful login
                try {
                    const metersStore = useMetersStore();
                    // Clear any existing meters and fetch fresh ones
                    metersStore.clearMeters();
                    await metersStore.fetchMeters();
                } catch (error) {
                    console.error('Error fetching meters on login:', error);
                    // Don't block navigation if meters fetch fails
                }

                const config = useRuntimeConfig()
                if (config.public?.uatvendAutoSignIn) {
                    try {
                        const uvendRes = await uatvendSignIn(email, password)
                        const payload = uvendRes?.data || uvendRes || {}
                        const accessToken = payload?.access_token || payload?.accessToken || payload?.token || payload?.jwt || null
                        const refreshToken = payload?.refresh_token || payload?.refreshToken || null
                        if (accessToken) {
                            setUatvendTokens({
                                access_token: String(accessToken),
                                ...(refreshToken ? { refresh_token: String(refreshToken) } : {})
                            })
                        }
                    } catch (error) {
                        console.error('UVEND2 sign-in failed:', error)
                        this.$toast({
                            title: 'Analytics Sign In Failed',
                            description: 'Unable to sign in to analytics. Please try again.',
                            variant: 'destructive'
                        })
                    }
                }
                
                return navigateTo('/');
            }catch(e){
                console.error('Sign in error:', e);
                // Extract error message from response
                let errorMessage = 'There was a problem with your request.';
                const errorData = e?.response?._data || e?.data || {};
                
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                    errorMessage = errorData.errors.map(err => err.message || err).join(', ');
                } else if (e?.message) {
                    errorMessage = e.message;
                } else if (typeof e === 'string') {
                    errorMessage = e;
                }
                
                this.$toast({
                    title: 'Sign In Failed',
                    description: errorMessage,
                    variant: "destructive"
                });
            }finally{
                this.isLoading = false;
            }
        },
        valid(){
            this.invalid = []
            if(!this.email || !this.email.trim()) this.invalid.push('email')
            if(!this.password || !this.password.trim()) this.invalid.push('password')
            if(this.invalid.length > 0) return false
            return true
        }
    },
    created() {
        this.debounceSignIn = _.debounce(this.signIn, 300);
    }
}
</script>