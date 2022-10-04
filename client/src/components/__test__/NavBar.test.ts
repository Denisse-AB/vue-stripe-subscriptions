import { describe, it, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import router from '@/router'
import NavBarVue from '../NavBar.vue'

describe('NavBar', () => {
  it('mounts properly', () => {
    const wrapper = mount(NavBarVue, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.text()).toContain('About')
  })

  test('click buttons', async () => {
    const wrapper = mount(NavBarVue, {
      global: {
        plugins: [router]
      }
    })

    const push = vi.spyOn(router, 'push')

    // trigger the image anchor tag
    await wrapper.find('a').trigger('click')
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/')

    // trigger the about anchor tag
    await wrapper.find('a[type=button]').trigger('click')
    expect(push).toHaveBeenCalledTimes(2)
    expect(push).toHaveBeenCalledWith('/about')
  })
})
