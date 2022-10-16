import router from '@/router'
import ThankYouVue from '@/views/ThankYou.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

function mountThankyouVue() {
  const wrapper = mount(ThankYouVue, {
    global: {
      plugins: [router, createTestingPinia()]
    },
    props: {
      subscription: '123'
    }
  })
  return wrapper
}

describe('Thankyou component', () => {
  it('Mounts the thank you component', () => {
    expect(mountThankyouVue()).toBeTruthy()
    expect(mountThankyouVue().text()).toContain('Thank you!')
  })

  it('Click the span', async () => {
    const span = mountThankyouVue().find('span')
    const SpyOnSpan = vi.spyOn(span, 'trigger')

    await span.trigger('click')
    expect(SpyOnSpan).toHaveBeenCalledOnce()
  })
})
