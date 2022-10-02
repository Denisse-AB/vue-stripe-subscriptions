import { createApp } from 'vue'
import { defineRule } from 'vee-validate'
import { createPinia } from 'pinia'
import { required, email, alpha_spaces, digits, max } from '@vee-validate/rules'
import App from './App.vue'
import router from './router'

import './index.css'

// vee-validate rules
defineRule('required', required)
defineRule('email', email)
defineRule('alpha_spaces', alpha_spaces)
defineRule('digits', digits)
defineRule('max', max)

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
