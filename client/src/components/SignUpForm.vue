<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import FormInput from './FormInput.vue'

const name = ref('')
const email = ref('')
const address = ref('')
const city = ref('')
const postal_code = ref('')
const state = ref('')
const disabled = ref(false)

const router = useRouter()
const store = useUserStore()

const SignUp = async () => {
  disabled.value = true
  const zipCode = parseInt(postal_code.value)

  try {
    const res = await store.createCustomer(
      email.value,
      name.value,
      address.value,
      city.value,
      state.value.toUpperCase(),
      zipCode
    )
    if (res) {
      router.push({ name: 'plan' })
    } else {
      disabled.value = false
      alert('Error creating Customer, Try again later!')
    }
  } catch (error) {
    disabled.value = false
    alert('An error has ocurred, try again later!')
  }
}
</script>

<template>
  <form @submit.prevent="SignUp">
    <!-- Add a country input field if you live outside of the USA -->
    <FormInput v-model="name" name="Name" type="text" rules="required|alpha_spaces" />
    <FormInput v-model="email" name="E-mail" type="email" rules="required|email" />
    <FormInput v-model="address" name="Address" type="text" rules="required" />
    <FormInput v-model="city" name="City" type="text" rules="required|alpha_spaces" />
    <div class="grid grid-cols-2 gap-2">
      <FormInput v-model="state" name="State" type="text" rules="required|alpha_spaces|max:2" />
      <FormInput v-model="postal_code" name="Postal Code" type="text" rules="required|max:6" />
    </div>
    <div class="justify-center m-2">
      <button
        class="w-full mb-2 pb-1 text-white shadow-md bg-indigo-500 border mt-5 rounded-sm hover:bg-indigo-400"
        type="submit"
        :disabled="disabled"
      >
        Subscribe
      </button>
    </div>
  </form>
</template>
