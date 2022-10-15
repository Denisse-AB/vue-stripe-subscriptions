<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePlanStore } from '../stores/subscription'
import { useUserStore } from '../stores/user'
import PlanCard from '../components/PlanCard.vue'

const planStore = usePlanStore()
const userStore = useUserStore()
const router = useRouter()

async function createSubscription(priceId: string | undefined, price: string, plan: string) {
  try {
    const res = await planStore.createSubscription(userStore.userData.id, priceId, price, plan)
    if (res) {
      router.push({ name: 'checkout' })
    } else {
      alert('Error creating subscrition, Try again later!')
    }
  } catch (error) {
    alert('An error has occurred with our server. Try again later')
  }
}

const standardPlan = () => {
  const priceId = import.meta.env.VITE_BASIC_PLAN
  const price = '5.00'
  const plan = 'Basic'
  createSubscription(priceId, price, plan)
}

const premiumPlan = () => {
  const priceId = import.meta.env.VITE_PREMIUM_PLAN
  const price = '10.00'
  const plan = 'Premium'
  createSubscription(priceId, price, plan)
}
</script>

<template>
  <div class="mx-auto" v-if="userStore.userData.id">
    <h1
      class="text-center text-transparent bg-clip-text bg-gradient-to-r from-[#41b883] to-[#6366f1] text-2xl font-bold my-7 py-1 tablet:font-extrabold tablet:text-4xl"
    >
      Choose your Subscription!
    </h1>
    <div class="grid tablet:grid-cols-2 tablet:gap-2">
      <PlanCard
        title="Standard Plan"
        :amount="5"
        icon-1="2 team members"
        icon-2="5gb"
        @click="standardPlan"
      />
      <PlanCard
        title="Premium Plan"
        :amount="10"
        icon-1="4 team members"
        icon-2="10gb"
        @click="premiumPlan"
      />
    </div>
  </div>
</template>
