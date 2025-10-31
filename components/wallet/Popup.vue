<template>
    <Button @click="toggleOpen()" :class="buttonClass" :variant="buttonVariant" v-if="hasButton">
        {{ buttonLabel }}
    </Button>
    <Drawer v-if="isMobile" v-model:open="isOpen">
        <DrawerContent class="h-[90vh] flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-white">
            <!-- Header with gradient - fixed -->
            <div class="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-t-2xl">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <Icon name="lucide:wallet" class="h-4 w-4 text-white"/>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-white">Top Up Wallet</h3>
                            <p class="text-xs text-white/80">Add funds to your account</p>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        @click="isOpen = false"
                        class="text-white hover:bg-white/20 hover:text-white"
                    >
                        <Icon name="lucide:x" class="h-4 w-4"/>
                    </Button>
                </div>
            </div>
            
            <!-- Scrollable content area -->
            <div class="flex-1 overflow-y-auto bg-gradient-to-b from-white to-blue-50/20">
                <div class="p-4 pb-8">
                    <slot />
                </div>
            </div>
        </DrawerContent>
    </Drawer>
    <Dialog v-else v-model:open="isOpen">
        <DialogContent class="p-0 max-w-md mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <div class="relative overflow-hidden rounded-2xl">
                <!-- Header with gradient background -->
                <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Icon name="lucide:wallet" class="h-5 w-5 text-white"/>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white">Top Up Wallet</h3>
                                <p class="text-sm text-white/90">Add funds to your account</p>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            @click="isOpen = false"
                            class="text-white hover:bg-white/20 hover:text-white rounded-xl"
                        >
                            <Icon name="lucide:x" class="h-5 w-5"/>
                        </Button>
                    </div>
                    
                    <!-- Decorative elements -->
                    <div class="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                </div>
                
                <!-- Content area with subtle background -->
                <div class="p-6 bg-gradient-to-b from-white to-blue-50/30">
                    <slot />
                </div>
            </div>
        </DialogContent>
    </Dialog>
    
</template>
<script>
export default{
    props:{
        buttonClass: "",
        buttonLabel: "",
        buttonVariant: "primary",
        hasButton: {
            type: Boolean,
            default: true
        },
        modelValue: {
            type: Boolean,
            default: false
        },
    },
    data(){
        return {
            isMobile: false,
            localOpen: this.modelValue
        }
    },
    computed: {
        isOpen: {
            get() {
                return this.localOpen; // Return the local state
            },
            set(value) {
                this.localOpen = value; // Update local state
                this.$emit('update:modelValue', value); // Emit the updated value to the parent
            }
        }
    },
    methods:{
        toggleOpen(){
            console.log(this.isOpen); // Log the current state
            this.isOpen = !this.isOpen; // Toggle the computed property
        },
        checkMobile() {
            // Check for mobile devices with a more comprehensive approach
            this.isMobile = window.innerWidth <= 768 || 
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        },
    },
    mounted(){
        this.checkMobile()
        window.addEventListener('resize', this.checkMobile)
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile)
    },
    watch: {
        modelValue(newValue) {
            this.localOpen = newValue; // Sync local state with prop changes
        }
    },
}
</script>