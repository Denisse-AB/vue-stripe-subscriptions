<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/FooterComp.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col justify-start">
    <NavBar />
    <RouterView />
    <Footer />
  </div>
</template>
