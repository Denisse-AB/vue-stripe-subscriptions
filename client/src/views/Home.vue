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
        <v-row
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
import PostService from '../post-service'

export default {
  name: 'Home',

  data: () => ({
    loading: false,
    alert1: false,
    alert2: false,
    valid: false,
    alertTxt: '',
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

  methods: {
    async Signup() {
      const { email, fullname } = this
      try {
        const res = await PostService.createCust(
          email,
          fullname
        )

        if (res.data.customer) {
          this.$router.push({
            name:'Plan',
            params: {
              fullName: fullname,
              customerId: res.data.customer
            },
            props: true
          })
        }

      } catch (error) {
        this.alert1 = true;
        this.alertTxt = 'Error, Try again!'
      }
    }
  }
}
</script>

<style lang="scss">
  h2 {
    color: $header-color;
    text-shadow: 2px 2px $header-text-color;
    font-size: 50px;
  }
  h1 {
    color: $header-1;
  }
  input {
    font-weight: bold;
  }
  #btnColor {
    background-color: $header-1;
    color: $white;
  }
  #stripeBtn {
    background-color: $stripeBtn;
    color: $white;
  }
  p.price-tag {
    font-size: 40px;
    color: $price-tag-color;
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
      background-color: $plan-background-color;
    }
  }

</style>
