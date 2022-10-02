<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { usePlanStore } from '../stores/subscription'

const userStore = useUserStore()
const planStore = usePlanStore()
const router = useRouter()
const disabled = ref(false)
const card = ref(null)

const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
const elements = stripe.elements()

const style = {
  base: {
    color: '#32325d',
    colorPrimary: '#6366f1',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
}

const el = elements.create('card', { style: style })

function displayError(event: typeof stripe) {
  const displayError: typeof stripe = document.getElementById('card-errors')
  if (event.error) {
    displayError.textContent = event.error.message
  } else {
    displayError.textContent = ''
  }
}

onMounted(() => {
  el.mount(card.value)

  el.on('change', (event: HTMLElement) => {
    displayError(event)
  })
})

const Submit = async () => {
  disabled.value = true
  const clientSecret = planStore.planData.clientSecret
  const fullName = userStore.userData.name

  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      type: 'card',
      card: el,
      billing_details: {
        name: fullName
      }
    }
  })
  if (result.error) {
    disabled.value = false
    alert(result.error.message)
  } else {
    // Successful subscription payment
    // The subscription automatically becomes active upon payment.
    router.push({
      name: 'thankyou',
      params: {
        subscription: planStore.planData.subscriptionId
      }
    })
  }
}
</script>

<template>
  <div v-if="planStore.planData.clientSecret">
    <ul role="list" class="my-7 mx-3 space-y-2">
      <li class="flex space-x-3">
        <!-- Icon -->
        <svg class="w-8 h-8 text-gray-600" viewBox="0 0 24 24">
          <path fill="currentColor" d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z" />
        </svg>
        <span class="text-2xl font-normal leading-tight text-gray-500"
          >Total: <b>${{ planStore.planChose.price }}</b></span
        >
      </li>
      <li class="flex space-x-3">
        <svg class="w-8 h-8 text-gray-600" viewBox="0 0 24 24">
          <path fill="currentColor" d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z" />
        </svg>
        <span class="text-2xl font-normal leading-tight text-gray-500"
          >Plan: <b>{{ planStore.planChose.plan }}</b></span
        >
      </li>
      <li class="flex space-x-3">
        <svg class="w-8 h-8 text-gray-600" viewBox="0 0 24 24">
          <path fill="currentColor" d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z" />
        </svg>
        <span class="text-2xl font-normal leading-tight text-gray-500"
          >Name: <b>{{ userStore.userData.name }}</b></span
        >
      </li>
    </ul>
    <div class="mt-5">
      <!-- stripe -->
      <div ref="card" class="mx-3 p-2.5 rounded-md border-2 border-solid">
        <!-- Elements will create input elements here -->
      </div>

      <!-- We'll put the error messages in this element -->
      <div
        id="card-errors"
        role="alert"
        class="mx-3 text-error-message text-lg font-semibold"
      ></div>
      <div class="justify-center mx-3">
        <button
          class="w-full h-8 mb-3 text-white shadow-md bg-indigo-500 border mt-5 rounded-md hover:bg-indigo-400 pb-1"
          :disabled="disabled"
          @click="Submit"
        >
          Pay with Stripe
        </button>
      </div>
    </div>
  </div>
</template>
