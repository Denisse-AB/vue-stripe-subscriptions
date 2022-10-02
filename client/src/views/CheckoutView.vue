<script setup lang="ts">
import { usePlanStore } from '@/stores/subscription'
import CardLayout from '../components/CardLayout.vue'

const planStore = usePlanStore()
</script>

<template>
  <div v-if="planStore.planData.clientSecret">
    <CardLayout :is-home-view="false" />
  </div>
</template>
