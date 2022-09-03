<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { usePlanStore } from '../stores/subscription';
import { useUserStore } from '../stores/user';

const planStore = usePlanStore()
const userStore = useUserStore()
const route = useRouter()

const props = defineProps<{
  subscription: string
}>()

const Cancel = async () => {
try {
  const res = await planStore.deleteSubscription(
    props.subscription
  )
  if(res?.status === 200) {
    planStore.$reset()
    userStore.$reset()
    route.push({ name: 'home' })
  }
} catch (error) {
    console.log(error);
    alert('Error deleting transaction');
  }
}
</script>

<template>
   <div class="container mx-auto" v-if="props.subscription">
    <h1 class="mt-10 font-bold text-2xl text-center">
      Thank you!
    </h1>
    <div class="p-4 m-5 tablet:flex bg-yellow-200 border-l-8 border-yellow-500">
      <svg class="w-6 h-6 mobile:float-left mr-1" viewBox="0 0 24 24">
          <path fill="currentColor" d="M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z" />
      </svg>
      <h3 class="font-Raleway font-semibold ml-1">
        Cancel button for testing purposes. Build a login system
        to allow customers to cancel their subscriptions.
      </h3>
      <button @click='Cancel' class="p-1 mt-2 ml-1 rounded-sm font-semibold shadow-sm border border-yellow-600 bg-yellow-500 hover:bg-yellow-400 tablet:m-0 laptop:ml-20">Cancel</button>
    </div>
  </div>
</template>