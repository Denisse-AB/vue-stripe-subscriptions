<script setup lang="ts">
import { Field } from 'vee-validate'
import { defineProps, defineEmits } from 'vue'

defineProps<{
  modelValue: string
  name: string
  type: string
  rules: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative z-0 mb-6 mx-4 group">
    <Field :name="name" :rules="rules" v-slot="{ field, errors }">
      <input
        data-testid="test-input"
        :class="[
          'block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ' +
            (errors[0]
              ? 'border-red-500 focus:ring-0 focus:ring-red-500'
              : 'focus:valid:border-blue-300 focus:ring-0 focus:ring-blue-300')
        ]"
        v-bind="field"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        placeholder=" "
        required
      />
      <label
        class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
        for="name"
        >{{ name }}</label
      >
      <span class="text-rose-500">{{ errors[0] }}</span>
    </Field>
  </div>
</template>
