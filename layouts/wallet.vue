<template>
<div>
    <!-- Overlay for mobile nav -->
    <div v-if="isNavOpen"
        @click="toggleNav"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300">
    </div>
    <div class="flex h-screen bg-gradient-to-br from-orange-200 via-orange-100 to-orange-50">
    <!-- Sidebar -->
    <aside
        class="bg-gradient-to-b from-orange-600 to-orange-700 h-screen shadow-xl transition-all duration-300 ease-in-out flex-shrink-0 relative flex-col"
        :class="[
            'hidden md:flex w-64 flex-col',
            isMobile && isNavOpen ? 'fixed top-0 left-0 z-50 w-64 p-4 flex' : '',
            isMobile && !isNavOpen ? 'w-0 p-0 overflow-hidden hidden' : '',
        ]"
        :style="{ backgroundColor: bgColor, color: fontColor }"
    >
        <!-- Logo Section -->
        <div class="flex items-center justify-between p-6 border-b border-orange-500/30">
            <div class="flex items-center gap-4">
                <MyLogo />
            </div>
        </div>
        <!-- Navigation Menu -->
        <nav class="flex-1 p-4 space-y-2">
            <!-- Home -->
            <NuxtLink 
                class="menu-item group flex items-center justify-start px-4 py-3 rounded-xl text-white hover:bg-white/10 hover:shadow-lg font-medium transition-all duration-200" 
                to="/"
                @click="isMobile && toggleNav()"
            >
                <div class="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Icon name="lucide:home" class="h-5 w-5"/>
                </div>
                <div class="flex flex-col ml-3">
                    <span class="text-sm font-medium">Home</span>
                    <span class="text-xs text-orange-200">Overview</span>
                </div>
            </NuxtLink>
            <!-- Transactions -->
            <NuxtLink 
                class="menu-item group flex items-center justify-start px-4 py-3 rounded-xl text-white hover:bg-white/10 hover:shadow-lg font-medium transition-all duration-200" 
                to="/transactions"
                @click="isMobile && toggleNav()"
            >
                <div class="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Icon name="lucide:receipt" class="h-5 w-5"/>
                </div>
                <div class="flex flex-col ml-3">
                    <span class="text-sm font-medium">Transactions</span>
                    <span class="text-xs text-orange-200">Payment History</span>
                </div>
            </NuxtLink>
            <!-- Payments -->
            <NuxtLink 
                class="menu-item group flex items-center justify-start px-4 py-3 rounded-xl text-white hover:bg-white/10 hover:shadow-lg font-medium transition-all duration-200" 
                to="/payments"
                @click="isMobile && toggleNav()"
            >
                <div class="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Icon name="lucide:wallet" class="h-5 w-5"/>
                </div>
                <div class="flex flex-col ml-3">
                    <span class="text-sm font-medium">Payments</span>
                    <span class="text-xs text-orange-200">Manage</span>
                </div>
            </NuxtLink>

        </nav>
        <!-- Footer links -->
        <!-- <nav class="p-4 border-t border-blue-500/30">
            <NuxtLink 
                to="/settings" 
                class="menu-item group flex items-center justify-start px-4 py-3 rounded-xl text-white hover:bg-white/10 hover:shadow-lg font-medium transition-all duration-200"
                @click="isMobile && toggleNav()"
            >
                <div class="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Icon name="lucide:settings" class="h-5 w-5"/>
                </div>
                <div class="flex flex-col ml-3">
                    <span class="text-sm font-medium">Settings</span>
                    <span class="text-xs text-blue-200">Preferences</span>
                </div>
            </NuxtLink>
        </nav> -->
    </aside>
    <!-- Main content -->
    <div class="flex-1 flex flex-col h-screen">
        <header class="flex justify-between items-center py-3 px-4 sm:px-6 bg-white/95 backdrop-blur-sm shadow-sm border-b border-orange-200 flex-shrink-0">
            <!-- Left side - Greeting Section -->
            <div class="flex items-center gap-3 sm:gap-4">
                <div class="flex items-center gap-2 z-[9999999999]">
                    <!-- User Menu Dropdown -->
                    <UserMenuDropdown />
                </div>
                <div>
                    <h1 class="text-base sm:text-lg font-semibold text-gray-800">Welcome back</h1>
                    <p class="text-xs sm:text-sm text-gray-600">{{ currentPageQuip }}</p>
                </div>
            </div>
            
        </header>
        <div class="flex-1 overflow-y-auto pb-20 md:pb-0" style="max-width: 100vw">
            <slot class="w-full"/>
        </div>
    </div>
    <!-- Mobile Bottom Nav -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <div class="flex justify-around items-stretch h-14">
            <NuxtLink to="/" :class="['flex flex-col items-center justify-center text-xs font-medium w-full relative', isActive('/') ? 'text-orange-700' : 'text-gray-700']" @click="toggleNav">
                <span v-if="isActive('/')" class="absolute top-0 inset-x-6 h-0.5 bg-orange-600 rounded-full"></span>
                <Icon name="lucide:home" class="h-5 w-5"/>
                <span>Home</span>
            </NuxtLink>
            <NuxtLink to="/transactions" :class="['flex flex-col items-center justify-center text-xs font-medium w-full relative', isActive('/transactions') ? 'text-orange-700' : 'text-gray-700']" @click="toggleNav">
                <span v-if="isActive('/transactions')" class="absolute top-0 inset-x-6 h-0.5 bg-orange-600 rounded-full"></span>
                <Icon name="lucide:receipt" class="h-5 w-5"/>
                <span>Transactions</span>
            </NuxtLink>
            <NuxtLink to="/payments" :class="['flex flex-col items-center justify-center text-xs font-medium w-full relative', isActive('/payments') ? 'text-orange-700' : 'text-gray-700']" @click="toggleNav">
                <span v-if="isActive('/payments')" class="absolute top-0 inset-x-6 h-0.5 bg-orange-600 rounded-full"></span>
                <Icon name="lucide:wallet" class="h-5 w-5"/>
                <span>Payments</span>
            </NuxtLink>

            <!-- <NuxtLink to="/settings" :class="['flex flex-col items-center justify-center text-xs font-medium w-full relative', isActive('/settings') ? 'text-blue-700' : 'text-gray-700']" @click="toggleNav">
                <span v-if="isActive('/settings')" class="absolute top-0 inset-x-6 h-0.5 bg-blue-600 rounded-full"></span>
                <Icon name="lucide:settings" class="h-5 w-5"/>
                <span>Settings</span>
            </NuxtLink> -->
        </div>
    </nav>
    
    </div>
</div>
</template>
<script>
import UserMenuDropdown from '~/components/wallet/UserMenuDropdown.vue'

export default{
	components: {
		UserMenuDropdown
	},
	data(){
		return {
		}
	},
	computed:{
		title(){
			const route = this.$route.path.split('/')
			if(route.length == 2 && route.at(-1) == 'wallet'){
				return "Home";
			}
			if(route.at(-1) === 'transactions'){
				return "Transaction History";
			}
			return route.at(-1)
		},
		currentPageTitle(){
			const route = this.$route.path
			if(route === '/' || route === '/wallet'){
				return "Dashboard Overview"
			}
			if(route === '/transactions'){
				return "Transaction History"
			}
			if(route === '/payments'){
				return "Payment Management"
			}
			if(route === '/settings'){
				return "Account Settings"
			}
			return "Wallet"
		},
		currentPageQuip(){
			const route = this.$route.path
			if(route === '/' || route === '/wallet'){
				return "Manage your utilities"
			}
			if(route === '/transactions'){
				return "Where money went 💸"
			}
			if(route === '/payments'){
				return "Wallet's best friend 💳"
			}
			if(route === '/settings'){
				return "Get personal ⚙️"
			}
			return "Ready to go!"
		},
		bgColor(){
			return `#${APP_BG_2?.replace('#', '') || '1287c9'}`
		},
		fontColor(){
			return `#${APP_FONT_COLOR_2?.replace('#', '') || 'ffffff'}`
		}
	},
	methods: {
		isActive(path){
			return this.$route.path === path
		},
		toggleNav(){
			this.isNavOpen = false
		}
	},
	async mounted() {
		// Load meters once when wallet layout is mounted
		const metersStore = useMetersStore();
		if (!metersStore.isLoaded && !metersStore.isLoading) {
			await metersStore.fetchMeters();
		}
	}
}
</script>
<style scoped>
.title{
    text-transform: capitalize;
}

.menu-item{
	width: 100%;
	cursor: pointer;
	align-items: center;
	transition: all 0.2s ease;
	position: relative;
	overflow: hidden;
}

.menu-item::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 0;
	background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
	transition: width 0.2s ease;
}

.menu-item:hover::before {
	width: 100%;
}

.menu-item:hover {
	transform: translateX(2px);
}
</style>