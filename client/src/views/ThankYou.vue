<template>
  <v-container class="text-center" v-if="subscriptionId">
    <br>
    <h1>
      Thankyou page!
    </h1>
    <h3 class="my-5 display-1">
      Cancel button for testing purposes. Build a login system
      to allow customers to cancel their subscriptions.
    </h3>
    <v-btn @click='Cancel' color="warning">Cancel</v-btn>
  </v-container>
</template>

<script>
import PostService from '../post-service';

export default {
  name: 'ThankYou',

  props: {
    subscriptionId: String
  },

  methods: {
    async Cancel() {
      try {
        const res = await PostService.delete(this.subscriptionId)

        if (res) {
          alert('Subscription Deleted');
        }
      } catch (error) {
        console.log(error);
        alert('Error deleting transaction');
      }
    }
  },
};
</script>
