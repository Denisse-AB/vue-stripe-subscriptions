import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from '@pinia/testing';
import router from "@/router";
import CardLayoutVue from "../CardLayout.vue";

import "../../main";

describe('CardLayout', () => {
  it('mounts properly', () => {
    const wrapper = mount(CardLayoutVue, {
      props: {
        isHomeView: true
      },
      global: {
        plugins: [router, createTestingPinia()]
      }
    })
    expect(wrapper.text()).toContain("Cancel anytime");
    // TODO: TEST INPUTS
  })
})