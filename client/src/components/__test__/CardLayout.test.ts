import { describe, it, expect, test } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { render } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import waitForExpect from 'wait-for-expect'
import router from '@/router'
import CardLayoutVue from '../CardLayout.vue'
import FormInputVue from '../FormInput.vue'

import '../../main'

interface Inputs {
  model: string
  name: string
  type: string
  rules: string
}

function mountTheCardLayoutVue() {
  const wrapper = mount(CardLayoutVue, {
    props: {
      isHomeView: true
    },
    global: {
      plugins: [router, createTestingPinia()]
    }
  })
  return wrapper
}

function mountTheInputField(inputParams: Inputs) {
  const { model, name, type, rules } = inputParams
  const { getByTestId } = render(FormInputVue, {
    props: {
      modelValue: model,
      name: name,
      type: type,
      rules: rules
    }
  })
  return getByTestId('test-input') as HTMLInputElement
}

describe('CardLayout', () => {
  it('mounts properly', () => {
    expect(mountTheCardLayoutVue().text()).toContain('Cancel anytime')
  })

  test('the signup form', () => {
    expect(mountTheCardLayoutVue().exists())
    expect(mountTheCardLayoutVue().text()).toContain('E-mail')
    expect(mountTheCardLayoutVue().text()).toContain('Name')
    expect(mountTheCardLayoutVue().text()).toContain('Address')
    expect(mountTheCardLayoutVue().text()).toContain('City')
    expect(mountTheCardLayoutVue().text()).toContain('State')
    expect(mountTheCardLayoutVue().text()).toContain('Postal Code')
  })

  test('the email input field with data', async () => {
    const inputParams = {
      model: 'email',
      name: 'E-mail',
      type: 'email',
      rules: 'required|email'
    }

    const input = mountTheInputField(inputParams)

    expect(input.textContent).toContain('')

    input.textContent = 'jane@doe.com'
    expect(input.textContent).toEqual('jane@doe.com')
  })

  test('the email input field validation', async () => {
    /* 
      Testing the required rule.
      Change the input.value to test different rules.
    */
    const inputParams = {
      model: 'email',
      name: 'E-mail',
      type: 'email',
      rules: 'required|email'
    }

    const input = mountTheInputField(inputParams)
    expect(input).toBeTruthy()

    input.value = ''
    input.dispatchEvent(new Event('change'))

    await flushPromises()
    await waitForExpect(() => {
      const span = document.querySelector('span') as HTMLSpanElement | null
      expect(span?.textContent).toBe('E-mail is not valid.')
    })
  })

  test('the name input field validation', async () => {
    const inputParams = {
      model: 'name',
      name: 'Name',
      type: 'text',
      rules: 'required|alpha_spaces'
    }

    const input = mountTheInputField(inputParams)
    expect(input).toBeTruthy()

    input.value = ''
    input.dispatchEvent(new Event('change'))

    await flushPromises()
    await waitForExpect(() => {
      const span = document.querySelector('span') as HTMLSpanElement | null
      expect(span?.textContent).toBe('Name is not valid.')
    })
  })

  test('the address input field validation', async () => {
    const inputParams = {
      model: 'address',
      name: 'Address',
      type: 'text',
      rules: 'required'
    }

    const input = mountTheInputField(inputParams)
    expect(input).toBeTruthy()

    input.value = ''
    input.dispatchEvent(new Event('change'))

    await flushPromises()
    await waitForExpect(() => {
      const span = document.querySelector('span') as HTMLSpanElement | null
      expect(span?.textContent).toBe('Address is not valid.')
    })
  })

  test('the city input field validation', async () => {
    const inputParams = {
      model: 'city',
      name: 'City',
      type: 'text',
      rules: 'required|alpha_spaces'
    }
    const input = mountTheInputField(inputParams)
    expect(input).toBeTruthy()

    input.value = ''
    input.dispatchEvent(new Event('change'))

    await flushPromises()
    await waitForExpect(() => {
      const span = document.querySelector('span') as HTMLSpanElement | null
      expect(span?.textContent).toBe('City is not valid.')
    })
  })

  test('the state input field validation', async () => {
    const inputParams = {
      model: 'state',
      name: 'State',
      type: 'text',
      rules: 'required|alpha_spaces'
    }
    const input = mountTheInputField(inputParams)
    expect(input).toBeTruthy()

    input.value = ''
    input.dispatchEvent(new Event('change'))

    await flushPromises()
    await waitForExpect(() => {
      const span = document.querySelector('span') as HTMLSpanElement | null
      expect(span?.textContent).toBe('State is not valid.')
    })
  })

  test('the postal code input field validation', async () => {
    const inputParams = {
      model: 'postal_code',
      name: 'Postal Code',
      type: 'text',
      rules: 'required|max:6'
    }
    const input = mountTheInputField(inputParams)
    expect(input).toBeTruthy()

    input.value = ''
    input.dispatchEvent(new Event('change'))

    await flushPromises()
    await waitForExpect(() => {
      const span = document.querySelector('span') as HTMLSpanElement | null
      expect(span?.textContent).toBe('Postal Code is not valid.')
    })
  })
})
