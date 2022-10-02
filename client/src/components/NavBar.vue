<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="shadow-md bg-black flex justify-between">
    <div class="mx-auto">
      <RouterLink to="/">
        <img alt="Vuetify Logo" class="ml-16 w-20 h-20" src="../assets/logo.svg" />
      </RouterLink>
    </div>

    <div class="place-self-center mr-8">
      <RouterLink
        type="button"
        class="justify-end bg-indigo-500 text-white p-2 rounded shadow hover:bg-indigo-400 focus:ring-2 focus:ring-slate-400"
        to="/about"
      >
        About
      </RouterLink>
    </div>
  </header>
</template>
