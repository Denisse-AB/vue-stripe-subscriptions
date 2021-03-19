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
        <!-- card 2 -->
        <transition name="fade">
          <v-row
            v-show="third"
            align="center"
            justify="center"
          >
            <v-card
              elevation="3"
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
                <v-icon>mdi-arrow-right-bold</v-icon>Subscribing to: <b>{{ plan }}</b>
              </v-card-text>
              <!-- form -->
              <v-form v-model="valid">
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="firstname"
                        :rules="nameRules"
                        :counter="15"
                        label="First name"
                        required
                      />
                    </v-col>

                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="lastname"
                        :rules="nameRules"
                        :counter="15"
                        label="Last name"
                        required
                      />
                    </v-col>
                  </v-row>
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
    valid: false,
    alertTxt: '',
    price: '',
    plan: '',
    customerId: '',
    firstname: '',
    lastname: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => v.length <= 15 || 'Name must be less than 15 characters',
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
    async Signup() {
      try {
        await PostService.createCust(this.email).then((res) => {
          if (res.data.customer) {
            this.first = false;
            this.second = true;
            this.third = false;
            this.customerId = res.data.customer;
          }
        });
      } catch (error) {
        this.alert1 = true;
        this.alertTxt = 'Insert Your Email';
      }
    },
    subsPlan1() {
      this.planId = process.env.VUE_APP_BASIC_PLAN;
      this.price = '5.00';
      this.plan = 'basic';
      this.disabled = true;
      this.disabled2 = false;
      this.next();
    },
    subsPlan2() {
      this.planId = process.env.VUE_APP_PREMIUM_PLAN;
      this.price = '10.00';
      this.plan = 'premium';
      this.disabled2 = true;
      this.disabled = false;
      this.next();
    },
    displayError(event) {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    },
    Submit() {
      this.loading = true;
      const fullName = `${this.firstname} ${this.lastname}`;
      // Create payment method.
      stripe.createPaymentMethod({
        type: 'card',
        card: card,
        billing_details: {
          name: fullName,
        },
      }).then(async (result) => {
        if (result.error) {
          this.displayError(result);
          this.loading = false;
        } else {
          await PostService.createSubs(
            this.firstname,
            this.lastname,
            this.planId,
            this.customerId,
            result.paymentMethod.id,
          ).then((res) => {
            if (res.data.status === 'active') {
              this.$router.push('ThankYou');
            } else {
              this.loading = false;
              this.alert = true;
              this.alertTxt = 'Error, Please try again later!';
            }
          }).catch((err) => {
            this.loading = false;
            if (err.response.status === 402) {
              this.alert = true;
              this.alertTxt = err.response.statusText;
            } else {
              this.alert = true;
              this.alertTxt = 'Error, Please try again later.';
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
  @import 'src/sass/variables.scss';
  h2 {
    font-family: $courette;
    color: $dark-slate-gray;
    text-shadow: 2px 2px $lighten-gray;
    font-size: 50px;
  }
  h1 {
    color: $royal-purple;
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
