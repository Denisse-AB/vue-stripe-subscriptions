import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../../stores/user'
import { flushPromises } from '@vue/test-utils'
import { expect, describe, test, beforeEach } from 'vitest'

const signUpMock = () => {
  const name = ref('Jane Doe')
  const email = ref('jane@gmail.com')
  const address = ref('Hill Town 123')
  const city = ref('San Diego')
  const postal_code = ref('00765')
  const state = ref('ca')

  const userStore = useUserStore()

  try {
    const zipCode = parseInt(postal_code.value)
    userStore.createCustomer(
      email.value,
      name.value,
      address.value,
      city.value,
      state.value.toUpperCase(),
      zipCode
    )
  } catch (error) {
    throw new Error()
  }
}

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('the SignUp()', () => {
    const userStore = useUserStore()

    expect(signUpMock).toBeTruthy()

    flushPromises()
    expect(userStore.createCustomer).rejects.toThrow()
  })

  test('The user store state', () => {
    const store = useUserStore()

    store.userData.name = 'John Doe'
    expect(store.userData.name).toBe('John Doe')

    store.userData.id = 'cus_MKXZEtNwe'
    expect(store.userData.id).toBe('cus_MKXZEtNwe')
  })
})
