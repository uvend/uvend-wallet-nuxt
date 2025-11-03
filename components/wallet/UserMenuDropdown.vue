<template>
  <div class="relative">
    <!-- User Icon Button -->
    <button 
      @click="toggleDropdown"
      class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <Icon name="lucide:user" class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
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
            class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
          >
            <Icon name="lucide:help-circle" class="w-4 h-4 mr-3" />
            <span>Help</span>
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
      showFaq: false
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
