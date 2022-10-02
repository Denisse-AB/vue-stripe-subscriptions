<script setup lang="ts">
import { defineProps } from 'vue'
import SignUpForm from './SignUpForm.vue'
import CheckoutForm from './CheckoutForm.vue'

defineProps<{
  isHomeView: boolean
}>()
</script>

<template>
  <div class="border-slate-600 rounded-sm mx-auto mt-10 w-72 shadow-lg tablet:w-1/2">
    <h5 class="bg-slate-300 h-10 text-center font-semibold py-2">Subscribe to our Newsletter</h5>
    <p class="text-center mb-2">* Cancel anytime</p>
    <div v-if="isHomeView">
      <SignUpForm />
    </div>
    <div v-else>
      <CheckoutForm />
    </div>
  </div>
</template>
