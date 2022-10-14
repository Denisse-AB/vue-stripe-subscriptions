import { setActivePinia, createPinia } from 'pinia'
import { usePlanStore } from '../../stores/subscription'
import { expect, describe, test, beforeEach } from 'vitest'
import { useUserStore } from '../user'
import { flushPromises } from '@vue/test-utils'

describe('Subscription Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('The subscription store state', () => {
    const planStore = usePlanStore()

    planStore.planData.subscriptionId = 'sub_NWNwHONX50RnSQ'
    expect(planStore.planData.subscriptionId).toBe('sub_NWNwHONX50RnSQ')

    planStore.planData.clientSecret = 'pi_1DseCRtJDk_secret_luryLyA99BdWW'
    expect(planStore.planData.clientSecret).toBe('pi_1DseCRtJDk_secret_luryLyA99BdWW')

    planStore.planChose.price = 'price_1LbrhtKy'
    expect(planStore.planChose.price).toBe('price_1LbrhtKy')

    planStore.planChose.plan = 'Basic'
    expect(planStore.planChose.plan).toBe('Basic')
  })

  test('createSubscription()', () => {
    const planStore = usePlanStore()

    const userStore = useUserStore()
    userStore.userData.id = 'id_123'

    flushPromises()

    expect(
      planStore.createSubscription(
        userStore.userData.id,
        import.meta.env.VITE_BASIC_PLAN,
        '5.00',
        'Basic'
      )
    ).toBeTruthy()
  })
})
