import { defineStore } from 'pinia'
import axios from 'axios'

interface UserData {
  id: string | null
  name: string
}

const url = '/stripe'

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: {} as UserData
  }),
  actions: {
    async createCustomer(
      email: string,
      fullname: string,
      address: string,
      city: string,
      state: string,
      zipCode: number
    ) {
      try {
        const res = await axios.post(`${url}/create-customer`, {
          email,
          fullname,
          address,
          city,
          zipCode,
          state
        })
        if (res.status === 200) {
          this.userData = res.data.customer
          return this.userData
        } else {
          throw new Error()
        }
      } catch (error) {
        throw new Error()
      }
    }
  }
})
