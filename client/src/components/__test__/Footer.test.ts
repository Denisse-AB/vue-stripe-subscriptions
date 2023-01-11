import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FooterVue from '../FooterComp.vue'

describe('Footer', () => {
  it('mounts properly', () => {
    const wrapper = mount(FooterVue)
    expect(wrapper.text()).toEqual('2023 — Codingpr.com')
  })
})
