import { defineStore } from 'pinia';

// Declare global WALLET_API_URL for TypeScript
declare const WALLET_API_URL: string;

export const useMetersStore = defineStore('meters', {
  state: () => ({
    meters: [] as any[],
    isLoading: false,
    isLoaded: false,
  }),

  getters: {
    hasMeters: (state) => state.meters && state.meters.length > 0,
    meterCount: (state) => state.meters.length,
  },

  actions: {
    async fetchMeters() {
      if (this.isLoading) return;
      
      this.isLoading = true;
      try {
        const response = await useWalletAuthFetch(`/meter`) as any;
        this.meters = response?.meters || [];
        this.isLoaded = true;
      } catch (error) {
        console.error('Error fetching meters:', error);
        this.meters = [];
        this.isLoaded = true;
      } finally {
        this.isLoading = false;
      }
    },

    setMeters(meters: any[]) {
      this.meters = meters || [];
    },

    addMeter(meter: any) {
      // Check if meter already exists (by meterNumber)
      const exists = this.meters.some(m => m.meterNumber === meter.meterNumber);
      if (!exists) {
        this.meters.push(meter);
      }
    },

    updateMeters(meters: any[]) {
      this.meters = meters || [];
    },

    clearMeters() {
      this.meters = [];
      this.isLoaded = false;
    },
  },
});

