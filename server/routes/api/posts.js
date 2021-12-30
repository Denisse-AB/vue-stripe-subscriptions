require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router()

// Your Db connection

// post
router.post('/', async (req, res) => {

  const { email, fullname } = req.body;

  if (!email && !fullname) {
    return res.sendStatus(400);
  }

  try {
    // pass customer fullname and additional parameters
    const customer = await stripe.customers.create({
      email: email,
      name: fullname
    })

    if (customer) {
      // save the customer.id as stripeCustomerId
      // in your database.
      return res.json({ customer: customer.id });
    }

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});
router.post('/subs', async (req, res) => {
  const { customerId, priceId } = req.body;

  if (!customerId && !priceId) {
    return res.sendStatus(403);
  }

  try {
    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });

  } catch (error) {
    res.statusMessage = error.message;
    res.status(400).end();
  }
});

// Webhook listener
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {

    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;

    try {
      event = await stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        process.env.STRIPE_WEBHOOK_SECRET
      );

      const dataObject = event.data.object;

      switch (event.type) {
        case 'invoice.paid':
          // Used to provision services after the trial has ended.
          // The status of the invoice will show up as paid. Store the status in your
          // database to reference when a user accesses your service to avoid hitting rate limits.
          break;
        case 'invoice.payment_failed':
          // If the payment fails or the customer does not have a valid payment method,
          // an invoice.payment_failed event is sent, the subscription becomes past_due.
          // Use this webhook to notify your user that their payment has
          // failed and to retrieve new card details.
          break;
        case 'customer.subscription.deleted':
          if (event.request != null) {
            // handle a subscription cancelled by your request
            // from above.
            console.log('Subscription deleted by request');
          } else {
            // handle subscription cancelled automatically based
            // upon your subscription settings.
            console.log('Subscription deleted automatically');
          }
          break;
        default:
          // Unexpected event type
          console.log('Unexpected event type');
      }

      // Return a response to acknowledge receipt of the event
      res.sendStatus(200);

    } catch (err) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);
module.exports = router
