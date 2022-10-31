import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'
import PlanCardVue from '../PlanCard.vue'
import PlanViewVue from '@/views/PlanView.vue'
import router from '@/router'

describe('The plan view', () => {
  it('click the plan card component', () => {
    const wrapper = mount(PlanViewVue, {
      global: {
        plugins: [router, createTestingPinia()]
      }
    })
    expect(wrapper).toBeTruthy()
    const spyOn = vi.spyOn(wrapper, 'trigger')

    wrapper.trigger('PlanCard', { button: 0 })

    flushPromises()
    expect(spyOn).toHaveBeenCalledOnce()
  })

  it('has the plan card button', () => {
    const { getByText } = render(PlanCardVue, {
      global: {
        plugins: [router, createTestingPinia()]
      },
      props: {
        title: '2 team members',
        amount: 5,
        icon1: '2 team members',
        icon2: '5gb'
      }
    })

    const button = getByText('Choose plan')
    expect(button).toBeTruthy()
  })
})
