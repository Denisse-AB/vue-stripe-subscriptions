<template>
  <v-container>
    <v-row no-gutters>
      <v-col
        v-if='customerId'
        col="12"
        class="text-center"
      >
        <h2 class="my-5 pb-8">
          Choose your Subscription!
        </h2>
          <v-alert
            v-model="alert2"
            color="red"
            dense
            dismissible
            type="error"
          >
            {{ alertTxt }}
          </v-alert>
        <transition name="fade">
          <v-row no-gutters>
            <v-col
              class="color rounded-l-xl"
              cols="6"
            >
              <!-- intra card -->
              <v-card
                class="mx-auto my-5"
                max-width="344"
                elevation="5"
              >
                <v-card-text>
                  <div><h1>Basic</h1></div>
                  <p class="price-tag my-9">
                    $5.00
                  </p>
                  <div class="text--primary">
                    <h3>
                      Per Month<br>
                      Billed Monthly
                    </h3>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    id="btnColor"
                    :disabled="disabled"
                    class="mx-auto mb-2"
                    @click="subsPlan1"
                  >
                    Select
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col
              class="color rounded-r-xl"
              cols="6"
            >
              <!-- intra card -->
              <v-card
                class="mx-auto my-5"
                max-width="344"
                elevation="5"
              >
                <v-card-text>
                  <div><h1>Premium</h1></div>
                  <p class="price-tag my-9">
                    $10.00
                  </p>
                  <div class="text--primary">
                    <h3>
                      Per Month<br>
                      Billed Monthly
                    </h3>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    id="btnColor"
                    :disabled="disabled2"
                    class="mx-auto mb-2"
                    @click="subsPlan2"
                  >
                    Seclect
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </transition>
      </v-col>
    </v-row>
    <v-footer
      padless
      absolute
      class="mt-10"
    >
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-col>
    </v-footer>
  </v-container>
</template>

<script>
import PostService from '../post-service'

export default {
  name: 'Plan',

  props: {
    fullName: String,
    customerId: String
  },

  data: () => ({
    disabled: false,
    disabled2: false,
    alert2: false,
    alertTxt: '',
  }),

  methods: {
    async createSubscription(priceId, price, plan) {
      const {fullName, customerId } = this
      try {
        const res = await PostService.createSubs(
          customerId,
          priceId,
        )

        if (res.data) {
          const subscriptionId = res.data.subscriptionId
          const clientSecret = res.data.clientSecret
          this.$router.push({
            name: 'Checkout',
            params: {
              fullName,
              price,
              plan,
              clientSecret,
              subscriptionId
            }
          })
        }

      } catch (err) {
        this.alert2 = true
        this.disabled = false
        this.alertTxt = 'An error has occurred. Try again later'
      }
    },

    async subsPlan1() {
      const priceId = process.env.VUE_APP_BASIC_PLAN
      const price = '5.00'
      const plan = 'Basic'
      this.disabled = true
      this.disabled2 = false
      await this.createSubscription(priceId, price, plan)
    },

    async subsPlan2() {
      const priceId = process.env.VUE_APP_PREMIUM_PLAN
      const price = '10.00'
      const plan = 'Premium'
      this.disabled2 = true
      this.disabled = false
      await this.createSubscription(priceId, price, plan)
    }
  }
}
</script>
