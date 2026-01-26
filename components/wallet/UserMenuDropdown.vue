<template>
  <div class="relative">
    <!-- User Icon Button -->
    <button 
      @click="toggleDropdown"
      class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center hover:from-orange-200 hover:to-orange-300 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <Icon name="lucide:user" class="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
    </button>

    <!-- Dropdown Menu - Using fixed positioning -->
    <Teleport to="body">
      <div 
        v-if="isOpen"
        class="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48"
        :style="dropdownStyle"
      >
        <!-- User Info Section -->
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-sm font-medium text-gray-900">User Account</p>
          <p class="text-xs text-gray-500">Manage your account</p>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <!-- Help Option -->
          <button
            @click="handleHelp"
            class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
          >
            <Icon name="lucide:help-circle" class="w-4 h-4 mr-3" />
            <span>Help</span>
          </button>

          <!-- Settings Option -->
          <button
            @click="openSettings"
            class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
          >
            <Icon name="lucide:settings" class="w-4 h-4 mr-3" />
            <span>Settings</span>
          </button>
          
          <!-- Logout Option -->
          <button
            @click="handleLogout"
            class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            <Icon name="lucide:log-out" class="w-4 h-4 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </Teleport>
    
    <!-- FAQ Popup -->
    <WalletFaqPopup v-model="showFaq" />

    <!-- Settings Modal -->
    <Teleport to="body">
      <div
        v-if="showSettings"
        class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40"
        @click.self="closeSettings"
      >
        <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-5 py-4 flex items-center justify-between">
            <div>
              <p class="text-base font-semibold">Usage Settings</p>
              <p class="text-xs text-white/80">Configure usage limits and fetch log reports</p>
            </div>
            <button @click="closeSettings" class="text-white/80 hover:text-white transition-colors">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <div class="p-5 space-y-5">
            <!-- Usage Limit -->
            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700">Daily Usage Limit (kWh)</label>
              <div class="flex gap-2">
                <input
                  v-model="usageLimit"
                  type="number"
                  min="0"
                  step="0.1"
                  class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter limit e.g. 35"
                />
                <button
                  @click="saveUsageLimit"
                  class="px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60"
                  :disabled="isSavingLimit"
                >
                  {{ isSavingLimit ? 'Saving...' : 'Save' }}
                </button>
              </div>
              <p class="text-xs text-gray-500">We will use this value to highlight high usage on the dashboard.</p>
            </div>

            <div class="border-t pt-4">
              <p class="text-xs text-gray-500">Usage log reports are now provided by UVEND2 analytics.</p>
            </div>
          </div>
          <div class="px-5 py-3 bg-gray-50 border-t flex justify-end">
            <button @click="closeSettings" class="text-sm font-semibold text-gray-600 hover:text-gray-900">
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Overlay to close dropdown when clicking outside -->
    <Teleport to="body">
      <div 
        v-if="isOpen"
        @click="closeDropdown"
        class="fixed inset-0 z-[9998]"
      ></div>
    </Teleport>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      buttonRect: null,
      showFaq: false,
      showSettings: false,
      usageLimit: localStorage.getItem('usage-limit') || '',
      isSavingLimit: false
    }
  },
  
  computed: {
    dropdownStyle() {
      if (!this.buttonRect) return {}
      
      return {
        top: `${this.buttonRect.bottom + 8}px`,
        left: `${this.buttonRect.left}px`,
        zIndex: 9999
      }
    }
  },
  methods: {
    toggleDropdown(event) {
      if (!this.isOpen) {
        // Capture button position when opening
        this.buttonRect = event.target.closest('button').getBoundingClientRect()
      }
      this.isOpen = !this.isOpen
    },
    
    closeDropdown() {
      this.isOpen = false
    },
    
    handleHelp() {
      this.showFaq = true
      this.closeDropdown()
    },

    openSettings() {
      this.showSettings = true
      this.closeDropdown()
    },

    closeSettings() {
      this.showSettings = false
    },

    async saveUsageLimit() {
      if (!this.usageLimit || Number(this.usageLimit) <= 0) {
        this.$toast({
          title: 'Invalid limit',
          description: 'Please enter a usage limit greater than zero.',
          variant: 'destructive'
        })
        return
      }
      this.isSavingLimit = true
      try {
        localStorage.setItem('usage-limit', this.usageLimit)
        this.$toast({
          title: 'Usage limit saved',
          description: `Your daily usage limit is set to ${this.usageLimit} kWh`
        })
      } catch (error) {
        console.error('Usage limit error:', error)
        this.$toast({
          title: 'Error',
          description: 'Unable to save the limit. Please try again.',
          variant: 'destructive'
        })
      } finally {
        this.isSavingLimit = false
      }
    },

    
    async handleLogout() {
      try {
        // Clear local storage
        localStorage.removeItem('wallet-access-token')
        localStorage.removeItem('wallet-refresh-token')
        
        // Show success message
        this.$toast({
          title: 'Logged out successfully',
          description: 'You have been logged out of your account',
          variant: 'default'
        })
        
        // Close dropdown
        this.closeDropdown()
        
        // Navigate to login page
        await navigateTo('/wallet/login')
        
      } catch (error) {
        console.error('Logout error:', error)
        this.$toast({
          title: 'Error',
          description: 'There was an error logging out. Please try again.',
          variant: 'destructive'
        })
      }
    }
  },
  
  mounted() {
    // Close dropdown when pressing escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown()
      }
    })
  },
  
  beforeUnmount() {
    // Clean up event listener
    document.removeEventListener('keydown', this.closeDropdown)
  }
}
</script>

<style scoped>
/* Custom dropdown animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
