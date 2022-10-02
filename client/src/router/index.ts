import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePlanStore } from '@/stores/subscription'
import HomeView from '../views/HomeView.vue'

function stopGuard() {
  const planStore = usePlanStore()
  const plan = planStore.planData.clientSecret
  if (!plan) return { path: '/' }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/plan',
      name: 'plan',

      beforeEnter: () => {
        // reject the navigation
        const userStore = useUserStore()
        const user = userStore.userData.id
        if (!user) return { path: '/' }
      },
      component: () => import('../views/PlanView.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      beforeEnter: [stopGuard],
      component: () => import('../views/CheckoutView.vue')
    },
    {
      path: '/thankyou/:subscription',
      name: 'thankyou',
      props: true,
      beforeEnter: [stopGuard],
      component: () => import('../views/ThankYou.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
