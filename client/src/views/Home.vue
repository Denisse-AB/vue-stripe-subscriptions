<template>
  <v-container>
    <v-row no-gutters>
      <v-col
        col="12"
        class="text-center"
      >
        <h2 class="my-5 pb-8">
          Choose your Subscription!
        </h2>
        <!-- email -->
        <v-row
          v-show="first"
          align="center"
          justify="center"
        >
          <transition name="fade">
            <v-card
              elevation="5"
            >
              <v-card-title
                id="font"
                class="gradient"
                primary-title
              >
                Subscribe to our Newsletter.
              </v-card-title>
              <p> * Cancel anytime </p>
              <v-form v-model="valid">
                <v-text-field
                  v-model="email"
                  color="indigo"
                  :rules="emailRules"
                  :counter="30"
                  label="E-mail"
                  class="mx-5 mb-3"
                  required
                />
                <v-text-field
                  class="mx-5 mb-3"
                  v-model="fullname"
                  :rules="nameRules"
                  :counter="30"
                  label="Full name"
                  required
                />
                <div>
                  <v-alert
                    type="warning"
                    v-model="alert1"
                    color="red"
                    class="mx-2"
                    dense
                    text
                    dismissible
                  >
                    {{ alertTxt }}
                  </v-alert>
                </div>
                <v-card-actions>
                  <v-btn
                    id="stripeBtn"
                    class="mb-2"
                    block
                    :loading="loading"
                    @click="Signup"
                  >
                    Sign Up
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </transition>
        </v-row>
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
          <v-row v-show="second">
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
                  <p class="patua my-9">
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
                  <p class="patua my-9">
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
        <!-- card 3 -->
        <transition name="fade">
          <v-row
            v-show="third"
            align="center"
            justify="center"
          >
            <v-card
              elevation="3"
              id="thirdCard"
            >
              <v-card-title
                id="font"
                primary-title
                class="gradient mb-5"
              >
                Enter your card details.<br>
              </v-card-title>

              <v-card-subtitle
                align="left"
                class="subtitle-1 mb-3"
              >
                <b>Your Subscription will start Now.</b>
              </v-card-subtitle>

              <v-card-text
                align="left"
                class="headline"
              >
                <v-icon>mdi-arrow-right-bold</v-icon>Total: <b>${{ price }}</b><br>
                <v-icon>mdi-arrow-right-bold</v-icon>Subscribing to: <b>{{ plan }}</b><br>
                <v-icon>mdi-arrow-right-bold</v-icon>Full Name: <b>{{ fullname }}</b>
              </v-card-text>
              <!-- form -->
              <v-form v-model="valid">
                <v-container>
                  <div class="mt-5">
                    <!-- stripe -->
                    <div
                      ref="card"
                      class="inputCard"
                    />

                    <!-- We'll put the error messages in this element -->
                    <div
                      id="card-errors"
                      role="alert"
                    />
                    <br>
                    <v-alert
                      v-model="alert"
                      color="red"
                      dense
                      dismissible
                      type="error"
                    >
                      {{ alertTxt }}
                    </v-alert>
                    <v-btn
                      id="stripeBtn"
                      class="my-3"
                      block
                      :loading="loading"
                      @click="Submit"
                    >
                      <v-icon class="mr-1">
                        mdi-credit-card-check-outline
                      </v-icon>
                      Pay with Stripe
                    </v-btn>
                  </div>
                </v-container>
              </v-form>
            </v-card>
          </v-row>
        </transition>
      </v-col>
    </v-row>
    <br><br><br>
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
import PostService from '../post-service';

const stripe = window.Stripe(process.env.VUE_APP_STRIPE_KEY);

// Create an instance of Elements.
const elements = stripe.elements();
const style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};
const card = elements.create('card', { style: style });

export default {
  name: 'Home',

  data: () => ({
    disabled: false,
    disabled2: false,
    first: true,
    second: false,
    third: false,
    loading: false,
    alert: false,
    alert1: false,
    alert2: false,
    valid: false,
    alertTxt: '',
    price: '',
    plan: '',
    subscriptionId: '',
    clientSecret: '',
    customerId: '',
    fullname: '',
    nameRules: [
      (v) => !!v || 'Full Name is required',
      (v) => v.length <= 30 || 'Your name must be less than 30 characters',
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => v.length <= 30 || 'E-mail must be less than 30 characters',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
  }),

  mounted() {
    card.mount(this.$refs.card);

    card.on('change', (event) => {
      this.displayError(event);
    });
  },

  methods: {
    next() {
      this.first = false;
      this.second = false;
      this.third = true;
    },

    displayError(event) {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    },

    async Signup() {
      try {
        const res = await PostService.createCust(
          this.email,
          this.fullname
        )

        if (res.data.customer) {
          this.first = false;
          this.second = true;
          this.third = false;
          this.customerId = res.data.customer;
        };

      } catch (error) {
        this.alert1 = true;
        this.alertTxt = 'Error, Try again!';
      }
    },

    async createSubscription(priceId) {
      try {
        const res = await PostService.createSubs(
          this.customerId,
          priceId,
        )

        if (res.data) {
          this.subscriptionId = res.data.subscriptionId,
          this.clientSecret = res.data.clientSecret,
          this.next();
        }

      } catch (err) {
        this.alert2 = true;
        this.alertTxt = 'An error has occurred. Try again later';
      }
    },

    async subsPlan1() {
      const priceId = process.env.VUE_APP_BASIC_PLAN;
      this.price = '5.00';
      this.plan = 'basic';
      this.disabled = true;
      this.disabled2 = false;
      await this.createSubscription(priceId);
    },

    async subsPlan2() {
      const priceId = process.env.VUE_APP_PREMIUM_PLAN;
      this.price = '10.00';
      this.plan = 'premium';
      this.disabled2 = true;
      this.disabled = false;
      await this.createSubscription(priceId);
    },

    async Submit() {
      this.loading = true;
      const result = await stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          type: 'card',
          card: card,
          billing_details: {
            name: this.fullname,
          },
        },
      });

      if (result.error) {
        this.alert = true;
        this.alertTxt = result.error.message;
        this.loading = false;
      } else {
        // Successful subscription payment
        this.$router.push('ThankYou');
      }
    },
  },
};
</script>

<style lang="scss" scope>
  h2 {
    color: $dark-slate-gray;
    text-shadow: 2px 2px $lighten-gray;
    font-size: 50px;
  }
  h1 {
    color: $royal-purple;
  }
  input {
    font-weight: bold;
  }
  #btnColor {
    background-color: $royal-purple;
    color: $white;
  }
  #stripeBtn {
    background-color: $stripeBtn;
    color: $white;
  }
  p.patua {
    font-size: 40px;
    color: $purple-darken-4;
  }
  .fade-enter-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .gradient {
    background: $gradient;
  }
    #card-errors{
    color: #fa755a
  }
  .inputCard{
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc
  }
  // Media Queries
  @media (max-width: $xs) {
    #thirdCard {
      max-width: 350px;
    }
    #font {
      font-size: 25px;
    }
    .color {
      background-color: $white;
    }
  }
  @media (min-width: $sm) {
    #font {
      font-size: 30px;
    }
    .color {
      background-color: $indigo-lighten-5;
    }
  }

</style>
