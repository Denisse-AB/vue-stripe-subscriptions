<template>
  <v-app-bar
    id="bar"
    app
    dark
  >
    <div class="d-flex align-center">
      <router-link to="/">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </router-link>
    </div>

    <v-spacer />

    <v-btn
      id="btnColor"
      text
      to="about"
    >
      About
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'NavBar',

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
  @import 'src/sass/variables.scss';

  #bar.v-app-bar {
    font-family: $body-font-family;
    #btnColor {
      background-color: $header-1;
    }
  }
</style>
