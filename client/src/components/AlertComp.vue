<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  colors: string
}>()
</script>

<template>
  <div :class="['p-4 m-5 border-l-8 tablet:flex tablet:w-4/5 tablet:mx-auto ' + props.colors]">
    <svg class="w-6 h-6 mobile:float-left mr-1" viewBox="0 0 24 24">
      <path fill="currentColor" d="M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z" />
    </svg>
    <h3 class="font-Raleway font-semibold ml-1">
      The cancel and change buttons are for testing purposes. Build a login system to allow
      customers to cancel and change their subscriptions.
    </h3>
  </div>
</template>
