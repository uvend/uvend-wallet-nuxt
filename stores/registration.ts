import { defineStore } from 'pinia'

interface RegistrationState {
  type: string
  personal: any
  documents: any
  banking: any
  address: any
  meters: any[]
  currentStep: number
}

export const useRegistrationStore = defineStore('registration', {
  state: (): RegistrationState => ({
    type: '',
    personal: null,
    documents: null,
    banking: null,
    address: null,
    meters: [],
    currentStep: 0
  }),

  actions: {
    setType(type: string) {
      this.type = type
      this.currentStep = 1
    },

    setPersonal(data: any) {
      this.personal = data
      this.currentStep = 2
    },

    setDocuments(data: any) {
      this.documents = data
      this.currentStep = 3
    },

    setBanking(data: any) {
      this.banking = data
      this.currentStep = 4
    },

    setAddress(data: any) {
      this.address = data
      this.currentStep = 5
    },

    setMeters(data: any[]) {
      this.meters = data
      this.currentStep = 6
    },

    reset() {
      this.type = ''
      this.personal = null
      this.documents = null
      this.banking = null
      this.address = null
      this.meters = []
      this.currentStep = 0
    },

    goBack() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    }
  },

  getters: {
    isComplete(): boolean {
      return !!(
        this.type &&
        this.personal &&
        this.documents &&
        this.banking &&
        this.address &&
        this.meters.length > 0
      )
    },

    formData(): any {
      return {
        type: this.type,
        personal: this.personal,
        documents: this.documents,
        banking: this.banking,
        address: this.address,
        meters: this.meters
      }
    }
  },

  persist: true
}) 