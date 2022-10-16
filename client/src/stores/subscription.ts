import { defineStore } from 'pinia'
import axios from 'axios'

interface PlanData {
  subscriptionId: string
  clientSecret: string
}

interface PlanChose {
  plan: string
  price: string
}

interface ChangeParams extends PlanChose {
  subscriptionId: string
  priceId: string
}

const url = '/stripe'

export const usePlanStore = defineStore('plan', {
  state: () => ({
    planData: {} as PlanData,
    planChose: {} as PlanChose
  }),
  actions: {
    async createSubscription(
      customerId: string | null,
      priceId: string | undefined,
      price: string,
      plan: string
    ) {
      try {
        const res = await axios.post(`${url}/create-subscription`, {
          customerId,
          priceId
        })
        if (res.status === 200) {
          this.planData = res.data
          this.planChose = { plan, price }
          return this.planData
        }
      } catch (error) {
        throw new Error()
      }
    },
    async deleteSubscription(subscriptionId: string) {
      try {
        const res = await axios.post(`${url}/delete-subscription`, {
          subscriptionId
        })
        if (res.status === 200) {
          alert('subscription deleted')
          return { status: 200 }
        }
      } catch (error) {
        throw new Error()
      }
    },
    async changeSubscription(changeParams: ChangeParams) {
      const { subscriptionId, priceId, plan, price } = changeParams

      try {
        const res = await axios.post(`${url}/update-subscription`, {
          subscriptionId,
          priceId
        })
        if (res.status === 200) {
          this.planData.subscriptionId = res.data.plan.id
          this.planChose = { plan, price }
          return { status: 200 }
        }
      } catch (error) {
        throw new Error()
      }
    }
  }
})
