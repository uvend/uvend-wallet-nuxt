<template>
    <!-- Success state -->
    <Card v-if="passwordResetComplete" class="w-[450px] max-w-[90vw] bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 via-green-700 to-green-800 p-6 text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div class="relative z-10 text-center">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Icon name="lucide:check-circle" class="h-8 w-8 text-white"/>
                </div>
                <h1 class="text-2xl font-bold mb-2">Password Reset Successful!</h1>
                <p class="text-sm text-white/90">Your password has been updated</p>
            </div>
        </div>
        <CardFooter class="p-6">
            <Button 
                class="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg shadow-green-500/30 transition-all duration-200" 
                @click="navigateTo('/wallet/login')"
            >
                <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4"/>
                Back to login
            </Button>
        </CardFooter>
    </Card>

    <!-- Reset form -->
    <Card v-else class="w-[450px] max-w-[90vw] bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
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
                        <Icon name="lucide:lock" class="h-5 w-5 text-white"/>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">Reset Password</h1>
                        <p class="text-sm text-white/90">Enter your new password</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Content area -->
        <CardContent class="p-6">
            <div class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <Icon name="lucide:shield" class="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"/>
                        <p class="text-sm text-gray-700">
                            Create a strong password with at least 8 characters, including letters and numbers.
                        </p>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <Label class="text-sm font-semibold text-gray-700">New Password</Label>
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
                </div>
            </div>
        </CardContent>
        
        <CardFooter class="p-6 pt-0 flex flex-col gap-3">
            <Button 
                class="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200" 
                @click="debounceResetPassword"
                :disabled="isLoading"
            >
                <Icon v-if="!isLoading" name="lucide:check" class="mr-2 h-4 w-4"/>
                <Icon v-else name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin"/>
                {{ isLoading ? 'Updating password...' : 'Update Password' }}
            </Button>
        </CardFooter>
    </Card>
</template>
<script>
import _ from 'lodash';
export default{
    props:{
        code: String
    },
    data(){
        return{
            password: null,
            passwordResetComplete: false,
            isLoading: false,
            showPassword: false
        }
    },
    methods:{
        async resetPassword(){
            try{
                if(!this.password) {
                    this.$toast({
                        title: 'Password Required',
                        description: 'Please enter a new password.',
                        variant: "destructive"
                    });
                    return;
                }
                if(!this.code) {
                    this.$toast({
                        title: 'Invalid Link',
                        description: 'The reset link is invalid or has expired.',
                        variant: "destructive"
                    });
                    return;
                }
                
                this.isLoading = true;
                const response = await useWalletAuthFetch(`/auth/reset`,{
                    method : "POST",
                    body: {
                        password : this.password,
                        code: this.code
                    }
                })
                if(response.success){
                    this.$toast({
                        title: 'Success!',
                        description: 'Your password has been updated successfully.',
                        variant: "success"
                    })
                    this.passwordResetComplete = true;
                }
                else{
                    throw new Error();
                }
            }catch(e){
                console.log('Reset password error:',e)
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem updating your password. Please try again.',
                    variant: "destructive"
                });
            }finally{
                this.isLoading = false;
            }
        }
    },
    created() {
        this.debounceResetPassword = _.debounce(this.resetPassword, 300);
    }
}
</script>