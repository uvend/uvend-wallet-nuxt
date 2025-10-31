<template>
  <div class="border-2 border-dashed rounded-lg p-6 text-center" 
       :class="error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary'">
    <div v-if="!modelValue" class="space-y-2">
      <div class="flex justify-center">
        <Upload class="h-10 w-10 text-gray-400" />
      </div>
      <div class="text-sm text-gray-500">
        <label :for="inputId" class="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
          <span>{{ label || 'Upload file' }}</span>
          <input 
            :id="inputId" 
            :name="name" 
            type="file" 
            class="sr-only" 
            @change="handleFileUpload" 
            :accept="accept"
            :multiple="multiple"
          >
        </label>
        <p>or drag and drop</p>
        <p class="text-xs">{{ acceptText || 'PDF, JPG, PNG up to 10MB' }}</p>
      </div>
    </div>
    <div v-else class="space-y-2">
      <div class="flex items-center justify-center">
        <FileCheck class="h-10 w-10 text-green-500" />
      </div>
      <p v-if="!multiple" class="text-sm font-medium">{{ modelValue.name }}</p>
      <div v-else class="space-y-1">
        <p v-for="(file, index) in modelValue" :key="index" class="text-sm font-medium">
          {{ file.name }}
        </p>
      </div>
      <button type="button" class="text-sm text-red-500" @click="removeFile">Remove</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Upload, FileCheck } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [File, Array],
    default: null
  },
  name: {
    type: String,
    default: 'file'
  },
  accept: {
    type: String,
    default: '.pdf,.jpg,.jpeg,.png'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Upload file'
  },
  acceptText: {
    type: String,
    default: 'PDF, JPG, PNG up to 10MB'
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => `file-input-${Math.random().toString(36).substr(2, 9)}`)

const validateFile = (file) => {
  if (!file) return false
  
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  
  if (file.size > maxSize) {
    return 'File size must be less than 10MB'
  }
  
  if (!allowedTypes.includes(file.type)) {
    return 'File must be PDF, JPG, or PNG'
  }
  
  return true
}

const handleFileUpload = (event) => {
  const files = event.target.files
  
  if (props.multiple) {
    const validFiles = []
    for (let i = 0; i < files.length; i++) {
      const validation = validateFile(files[i])
      if (validation === true) {
        validFiles.push(files[i])
      }
    }
    emit('update:modelValue', validFiles)
  } else {
    const file = files[0]
    if (file) {
      const validation = validateFile(file)
      if (validation === true) {
        emit('update:modelValue', file)
      }
    }
  }
}

const removeFile = () => {
  emit('update:modelValue', props.multiple ? [] : null)
}
</script> 