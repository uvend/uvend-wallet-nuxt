// Client-side plugin for html2pdf.js
export default defineNuxtPlugin(async () => {
  // Only load on client side
  if (process.client) {
    try {
      // Dynamically import html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default
      
      // Make it available globally
      return {
        provide: {
          html2pdf
        }
      }
    } catch (error) {
      console.error('Failed to load html2pdf.js:', error)
      return {
        provide: {
          html2pdf: null
        }
      }
    }
  }
})

