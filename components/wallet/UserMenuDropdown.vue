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
              <label class="text-sm font-semibold text-gray-700">Fetch Log Report</label>
              <p class="text-xs text-gray-500 mb-2">Enter a device serial to retrieve the latest usage logs from the M2M service.</p>
              <div class="flex gap-2 mb-3">
                <input
                  v-model="settingsSerial"
                  type="text"
                  class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Device serial e.g. 14537551856"
                />
                <button
                  @click="fetchLogReport"
                  class="px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60"
                  :disabled="isLoadingLogs"
                >
                  {{ isLoadingLogs ? 'Fetching...' : 'Fetch' }}
                </button>
              </div>

              <div class="bg-gray-50 rounded-xl border border-gray-100 max-h-56 overflow-y-auto p-3 space-y-3">
                <div v-if="logError" class="text-sm text-red-600">{{ logError }}</div>
                <div v-else-if="logReport.length === 0" class="text-sm text-gray-500">
                  No log entries yet. Fetch a report to view usage logs.
                </div>
                <div
                  v-for="entry in logReport"
                  :key="entry.timestamp + entry.value"
                  class="text-sm text-gray-700 flex items-center justify-between"
                >
                  <div>
                    <p class="font-semibold">{{ formatLogDate(entry.timestamp) }}</p>
                    <p class="text-xs text-gray-500">{{ formatLogTime(entry.timestamp) }}</p>
                  </div>
                  <p class="text-orange-600 font-bold">{{ Number(entry.value).toFixed(2) }} kWh</p>
                </div>
              </div>
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
import { useM2MApi } from '~/composables/useM2MApi'

export default {
  data() {
    return {
      isOpen: false,
      buttonRect: null,
      showFaq: false,
      showSettings: false,
      usageLimit: localStorage.getItem('usage-limit') || '',
      settingsSerial: '',
      isSavingLimit: false,
      isLoadingLogs: false,
      logError: null,
      logReport: []
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
      this.settingsSerial = ''
      this.logReport = []
      this.logError = null
      this.isLoadingLogs = false
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

    async fetchLogReport() {
      this.logError = null
      this.logReport = []
      if (!this.settingsSerial || !this.settingsSerial.trim()) {
        this.$toast({
          title: 'Serial required',
          description: 'Enter a device serial to fetch logs.',
          variant: 'destructive'
        })
        return
      }
      this.isLoadingLogs = true
      try {
        const m2mApi = useM2MApi()
        const logs = await m2mApi.getDeviceLogsBySerial(this.settingsSerial.trim())
        const usageLog = Array.isArray(logs)
          ? logs.find(log => log.name?.toLowerCase().includes('usage') || log.name?.toLowerCase().includes('period'))
          : null
        const entries = usageLog?.entries || usageLog?.readings || []
        if (!entries.length) {
          this.logError = 'No log entries returned for this serial.'
        } else {
          this.logReport = entries
            .map(entry => ({
              timestamp: entry.timestamp || entry.time || entry.created || new Date().toISOString(),
              value: entry.value || entry.Value || entry.reading || entry.Reading || 0
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10)
        }
      } catch (error) {
        console.error('Log report error:', error)
        this.logError = error?.statusMessage || error?.message || 'Failed to fetch log report.'
      } finally {
        this.isLoadingLogs = false
      }
    },

    formatLogDate(timestamp) {
      if (!timestamp) return 'Unknown date'
      try {
        return new Date(timestamp).toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch {
        return timestamp
      }
    },

    formatLogTime(timestamp) {
      if (!timestamp) return ''
      try {
        return new Date(timestamp).toLocaleTimeString('en-ZA', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      } catch {
        return ''
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
