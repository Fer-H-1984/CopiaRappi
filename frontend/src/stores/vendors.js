import { defineStore } from 'pinia'
import vendorsService from '../services/vendorsService'




export const useVendorsStore = defineStore('vendors', {
  state: () => ({
    vendors: [],
  }),
  actions: {
    async fetchVendors() {
      try {
        this.vendors = await vendorsService.getAllVendors()
      } catch (error) {
        console.error('Error fetching vendors:', error)
      }
    },
    async createVendor(vendorData) {
      try {
        const newVendor = await vendorsService.createVendor(vendorData)
        this.vendors.push(newVendor)
      } catch (error) {
        console.error('Error creating vendor:', error)
      }
    },
  },
})
