<template>
  <div class="p-4 sm:p-6">
    <!-- Profile overview -->
    <div v-if="currentView === 'overview'" class="space-y-6">
      <div class="text-center space-y-3">
        <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
          <Icon name="lucide:user" class="w-10 h-10 text-blue-700" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">My Profile</h2>
          <p class="text-sm text-gray-600 whitespace-normal break-words leading-relaxed max-w-md mx-auto">
            Manage your account preferences and personal details.
          </p>
        </div>
      </div>

      <div class="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white">
        <button
          class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          type="button"
          @click="openCommunication"
        >
          <div>
            <p class="text-sm font-medium text-gray-900">Communication</p>
            <p class="text-xs text-gray-500">Manage your notifications and contact preferences.</p>
          </div>
          <Icon name="lucide:chevron-right" class="w-4 h-4 text-gray-400" />
        </button>

        <button
          class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          type="button"
          @click="openManageAccount"
        >
          <div>
            <p class="text-sm font-medium text-gray-900">Manage Account</p>
            <p class="text-xs text-gray-500">Update your personal information and account settings.</p>
          </div>
          <Icon name="lucide:chevron-right" class="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Manage account interface -->
    <div v-else-if="currentView === 'manage'" class="space-y-5">
      <div class="flex items-center justify-between gap-3">
        <Button variant="ghost" class="px-2" @click="goBack">
          <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 class="text-base sm:text-lg font-semibold text-gray-900">Manage Account</h2>
        <div class="w-16" />
      </div>

      <!-- Tab layout (underline style) -->
      <div class="border-b border-gray-200">
        <button
          type="button"
          class="relative pb-3 pt-1 text-sm font-semibold transition-colors"
          :class="activeTab === 'personal' ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'"
          @click="activeTab = 'personal'"
        >
          Personal Info
          <span
            v-if="activeTab === 'personal'"
            class="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-blue-600"
          />
        </button>
      </div>

      <div v-if="activeTab === 'personal'" class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-gray-200 rounded-xl p-4">
        <div class="space-y-2">
          <Label class="text-xs font-semibold text-gray-800">Email</Label>
          <Input
            v-model="profile.email"
            type="email"
            readonly
            disabled
            class="bg-gray-100 border-2 border-gray-300 h-11 text-gray-600"
          />
        </div>
        <div class="space-y-2">
          <Label class="text-xs font-semibold text-gray-800">Display Name</Label>
          <Input
            v-model="profile.display_name"
            placeholder="Enter display name"
            class="bg-white border-2 border-gray-300 h-11 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-200"
          />
        </div>
        <div class="space-y-2 md:col-span-2">
          <Label class="text-xs font-semibold text-gray-800">VAT Number</Label>
          <Input
            v-model="profile.vat_registration_number"
            placeholder="Enter VAT registration number"
            class="bg-white border-2 border-gray-300 h-11 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-200"
          />
        </div>
        <div class="space-y-2">
          <Label class="text-xs font-semibold text-gray-800">Country</Label>
          <Input
            v-model="profile.country"
            placeholder="Enter country"
            class="bg-white border-2 border-gray-300 h-11 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-200"
          />
        </div>
        <div class="space-y-2">
          <Label class="text-xs font-semibold text-gray-800">City</Label>
          <Input
            v-model="profile.city"
            placeholder="Enter city"
            class="bg-white border-2 border-gray-300 h-11 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-200"
          />
        </div>
        <div class="space-y-2 md:col-span-2">
          <Label class="text-xs font-semibold text-gray-800">Address</Label>
          <Input
            v-model="profile.address"
            placeholder="Enter address"
            class="bg-white border-2 border-gray-300 h-11 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-200"
          />
        </div>
        <div class="space-y-2">
          <Label class="text-xs font-semibold text-gray-800">Postal Code</Label>
          <Input
            v-model="profile.postal_code"
            placeholder="Enter postal code"
            class="bg-white border-2 border-gray-300 h-11 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-200"
          />
        </div>
      </div>
      <div class="flex justify-end">
        <Button @click="onSaveProfile" :disabled="isSavingProfile">
          <Icon v-if="isSavingProfile" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
          Save
        </Button>
      </div>
    </div>

    <!-- Communication interface -->
    <div v-else-if="currentView === 'communication'" class="space-y-5">
      <div class="flex items-center justify-between gap-3">
        <Button variant="ghost" class="px-2" @click="goBack">
          <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 class="text-base sm:text-lg font-semibold text-gray-900">Communication</h2>
        <div class="w-16" />
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
        <div>
          <p class="text-sm font-semibold text-gray-900">Emails</p>
          <p class="text-xs text-gray-500">Choose which email notifications you want to receive.</p>
        </div>

        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-sm font-medium text-gray-900">Receipt Emails</p>
            <p class="text-xs text-gray-500">Receive email receipts after successful transactions.</p>
          </div>
          <button
            type="button"
            @click="onToggleReceiptEmails"
            :disabled="isUpdatingCommunication"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
            :class="receiptEmailsEnabled ? 'bg-blue-600' : 'bg-gray-300'"
            :aria-pressed="receiptEmailsEnabled"
          >
            <span
              class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200"
              :class="receiptEmailsEnabled ? 'translate-x-5' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: 'wallet'
})

export default {
  data() {
    return {
      currentView: 'overview',
      activeTab: 'personal',
      receiptEmailsEnabled: true,
      isSavingProfile: false,
      isUpdatingCommunication: false,
      profile: {
        email: '',
        vat_registration_number: '',
        display_name: '',
        country: '',
        city: '',
        address: '',
        postal_code: ''
      }
    }
  },
  methods: {
    buildUpdatePayload() {
      return {
        display_name: this.profile.display_name || null,
        vat_registration_number: this.profile.vat_registration_number || null,
        country: this.profile.country || null,
        city: this.profile.city || null,
        address: this.profile.address || null,
        postal_code: this.profile.postal_code || null,
        receive_email: Boolean(this.receiptEmailsEnabled),
      }
    },
    async updateUserInformation() {
      return await useWalletAuthFetch('/auth/me', {
        method: 'PUT',
        body: this.buildUpdatePayload(),
      })
    },
    async fetchCurrentUser() {
      try {
        const response = await useWalletAuthFetch('/auth/me')
        const user = response?.userInformation || {}
        this.profile = {
          email: user.email || '',
          vat_registration_number: user.vat_registration_number || '',
          display_name: user.display_name || '',
          country: user.country || '',
          city: user.city || '',
          address: user.address || '',
          postal_code: user.postal_code || ''
        }
        this.receiptEmailsEnabled = Boolean(user.receive_email)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    },
    async onSaveProfile() {
      if (this.isSavingProfile) return
      this.isSavingProfile = true
      try {
        await this.updateUserInformation()
        this.$toast({
          title: 'Saved',
          description: 'Account details updated successfully.',
        })
      } catch (error) {
        console.error('Error updating profile:', error)
        this.$toast({
          title: 'Error',
          description: 'Could not save account details.',
          variant: 'destructive',
        })
      } finally {
        this.isSavingProfile = false
      }
    },
    async onToggleReceiptEmails() {
      if (this.isUpdatingCommunication) return
      const previousValue = this.receiptEmailsEnabled
      this.receiptEmailsEnabled = !this.receiptEmailsEnabled
      this.isUpdatingCommunication = true
      try {
        await this.updateUserInformation()
        this.$toast({
          title: 'Updated',
          description: 'Email preference saved.',
        })
      } catch (error) {
        this.receiptEmailsEnabled = previousValue
        console.error('Error updating email preference:', error)
        this.$toast({
          title: 'Error',
          description: 'Could not update email preference.',
          variant: 'destructive',
        })
      } finally {
        this.isUpdatingCommunication = false
      }
    },
    openCommunication() {
      this.currentView = 'communication'
    },
    openManageAccount() {
      this.currentView = 'manage'
      this.activeTab = 'personal'
    },
    goBack() {
      this.currentView = 'overview'
    }
  },
  mounted() {
    this.fetchCurrentUser()
  }
}
</script>