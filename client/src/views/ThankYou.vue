<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanStore } from '../stores/subscription'
import { useUserStore } from '../stores/user'
import AlertComp from '../components/AlertComp.vue'

const planStore = usePlanStore()
const userStore = useUserStore()
const route = useRouter()

const props = defineProps<{
  subscription: string
}>()

const Cancel = async () => {
  try {
    const res = await planStore.deleteSubscription(props.subscription)
    if (res?.status === 200) {
      planStore.$reset()
      userStore.$reset()
      route.push({ name: 'home' })
    }
  } catch (error) {
    console.log(error)
    alert('Error deleting transaction')
  }
}

const Change = async () => {
  const currentPlan = planStore.planChose.plan
  const price = planStore.planChose.price === '5.00' ? '10.00' : '5.00'
  const plan = planStore.planChose.plan === 'Basic' ? 'Premium' : 'Basic'
  const priceId =
    currentPlan === 'Basic' ? import.meta.env.VITE_PREMIUM_PLAN : import.meta.env.VITE_BASIC_PLAN

  const changeSubscriptionParams = {
    subscriptionId: props.subscription,
    priceId: priceId,
    plan: plan,
    price: price
  }

  try {
    const res = await planStore.changeSubscription(changeSubscriptionParams)
    if (res?.status === 200) {
      alert('Your Plan changed successfully!')
    }
  } catch (error) {
    console.log(error)
    alert('Error deleting transaction')
  }
}
</script>

<template>
  <div class="container mx-auto" v-if="props.subscription">
    <h1
      class="text-center text-transparent bg-clip-text bg-gradient-to-r from-[#41b883] to-[#6366f1] text-2xl font-bold my-7 py-1 tablet:font-extrabold tablet:text-4xl"
    >
      Thank you!
    </h1>
    <div
      class="p-4 my-2 mx-auto text-center max-w-sm bg-white rounded-lg border shadow-md mobile:p-8 laptop:mt-12"
    >
      <h5 class="mb-4 text-xl font-medium text-gray-500">Your Subscription is now Active!</h5>
      <!-- List -->
      <ul role="list" class="my-7 space-y-5 divide-y divide-gray-200">
        <li class="flex space-x-3 justify-between">
          <span class="text-lg font-normal leading-tight text-gray-500">Subscription</span>
          <span class="text-lg font-normal leading-tight text-gray-500">{{
            planStore.planChose.plan
          }}</span>
        </li>
        <li class="flex pt-2 space-x-3 justify-between">
          <span class="text-lg font-normal leading-tight text-gray-500">Amount</span>
          <span class="text-lg font-normal leading-tight"
            >$ {{ planStore.planChose.price }} / Month</span
          >
        </li>
        <li class="flex pt-2 space-x-3 justify-between">
          <span class="text-lg font-normal leading-tight text-gray-500">Name</span>
          <span class="text-lg font-normal leading-tight text-gray-500">{{
            userStore.userData.name
          }}</span>
        </li>
      </ul>
      <div class="flex space-x-3 mb-0 justify-end">
        <span
          @click="Change"
          class="text-xl font-semibold leading-tight text-indigo-500 cursor-pointer"
          >Change</span
        >
        <span
          @click="Cancel"
          class="text-xl font-semibold leading-tight text-pink-500 cursor-pointer"
          >Cancel</span
        >
      </div>
    </div>
    <AlertComp colors="bg-yellow-200 border-yellow-500" />
  </div>
</template>
