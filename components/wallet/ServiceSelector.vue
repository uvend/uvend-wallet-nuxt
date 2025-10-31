<template>
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon name="lucide:layers" class="w-4 h-4 text-gray-600"/>
          </div>
          <div>
          <h3 class="text-lg font-semibold text-gray-900">Select Service</h3>
          <p class="text-sm text-gray-500">Choose your utility service</p>
        </div>
      </div>
    </div>

    <!-- Service Options -->
    <div class="p-4">
      <div class="flex gap-3">
        <!-- Electricity Service -->
        <div 
          class="relative cursor-pointer group flex-1"
          @click="selectService('Electricity')"
        >
          <div 
            class="relative p-3 rounded-lg border-2 transition-all duration-200 text-center"
            :class="selectedService === 'Electricity' 
              ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400 shadow-md' 
              : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-sm'"
          >
            <!-- Icon -->
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 transition-all duration-200"
                :class="selectedService === 'Electricity' 
                ? 'bg-gradient-to-br from-orange-200 to-orange-300 shadow-sm' 
                : 'bg-gradient-to-br from-orange-50 to-orange-100 group-hover:from-orange-100 group-hover:to-orange-200'"
              >
                <Icon 
                  name="lucide:zap" 
                class="w-5 h-5"
                :class="selectedService === 'Electricity' ? 'text-orange-700' : 'text-orange-600 group-hover:text-orange-700'"
                />
              </div>
              
              <!-- Service Name -->
            <h4 class="text-xs font-semibold text-gray-900 mb-1">Electricity</h4>
              
              <!-- Selection indicator -->
              <div 
                v-if="selectedService === 'Electricity'"
              class="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-sm"
              >
              <Icon name="lucide:check" class="w-2.5 h-2.5 text-white" />
              </div>
            <div 
              v-else
              class="w-4 h-4 border-2 border-orange-300 rounded-full mx-auto group-hover:border-orange-400 transition-colors duration-200"
            ></div>
          </div>
        </div>

        <!-- Water Service -->
        <div 
          class="relative cursor-pointer group flex-1"
          @click="selectService('Water')"
        >
          <div 
            class="relative p-3 rounded-lg border-2 transition-all duration-200 text-center"
            :class="selectedService === 'Water' 
              ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 shadow-md' 
              : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'"
          >
            <!-- Icon -->
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 transition-all duration-200"
                :class="selectedService === 'Water' 
                ? 'bg-gradient-to-br from-blue-200 to-blue-300 shadow-sm' 
                : 'bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200'"
              >
                <Icon 
                  name="lucide:droplet" 
                class="w-5 h-5"
                :class="selectedService === 'Water' ? 'text-blue-700' : 'text-blue-600 group-hover:text-blue-700'"
                />
              </div>
              
              <!-- Service Name -->
            <h4 class="text-xs font-semibold text-gray-900 mb-1">Water</h4>
              
              <!-- Selection indicator -->
              <div 
                v-if="selectedService === 'Water'"
              class="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-sm"
              >
              <Icon name="lucide:check" class="w-2.5 h-2.5 text-white" />
              </div>
            <div 
              v-else
              class="w-4 h-4 border-2 border-blue-300 rounded-full mx-auto group-hover:border-blue-400 transition-colors duration-200"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceSelector',
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue', 'service-selected'],
  data() {
    return {
      selectedService: this.modelValue
    }
  },
  watch: {
    modelValue(newValue) {
      this.selectedService = newValue
    }
  },
  methods: {
    selectService(service) {
      this.selectedService = service
      this.$emit('update:modelValue', service)
      this.$emit('service-selected', service)
      
      // Navigate to meters page with service type
      this.$router.push({
        path: '/meters',
        query: { service: service.toLowerCase() }
      })
    }
  }
}
</script>

