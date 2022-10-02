<script setup lang="ts">
defineProps<{
  title: string
  amount: number
  icon1: string
  icon2: string
}>()
</script>

<template>
  <div
    class="p-4 my-2 w-72 text-center max-w-sm bg-white rounded-lg border shadow-md mobile:p-8 laptop:mt-12"
  >
    <h5 class="mb-4 text-xl font-medium text-gray-500">{{ title }}</h5>
    <div class="flex items-baseline justify-center text-gray-900">
      <span class="text-3xl font-semibold">$</span>
      <span class="text-5xl font-extrabold tracking-tight">{{ amount }}</span>
      <span class="ml-1 text-xl font-normal text-gray-500">/month</span>
    </div>
    <!-- List -->
    <ul role="list" class="my-7 space-y-5">
      <li class="flex space-x-3">
        <!-- Icon -->
        <svg
          aria-hidden="true"
          class="flex-shrink-0 w-5 h-5 text-indigo-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Check icon</title>
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span class="text-base font-normal leading-tight text-gray-500">{{ icon1 }}</span>
      </li>
      <li class="flex space-x-3">
        <!-- Icon -->
        <svg
          aria-hidden="true"
          class="flex-shrink-0 w-5 h-5 text-indigo-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Check icon</title>
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span class="text-base font-normal leading-tight text-gray-500">{{ icon2 }}</span>
      </li>
    </ul>
    <button
      type="button"
      class="text-white bg-indigo-500 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-200 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
    >
      Choose plan
    </button>
  </div>
</template>
