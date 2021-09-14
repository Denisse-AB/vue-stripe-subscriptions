require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const router = express.Router()

// Db connection

// post
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.sendStatus(400);
  }

  try {
    const customer = await stripe.customers.create({
      email: email,
    })

    if (customer) {
      return res.json({ customer: customer.id });
    }

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

router.post('/subs', async (req, res) => {
  const { firstname, lastname, planId, customerId, paymentMethod } = req.body;

  if (!customerId && !paymentMethod) {
    return res.sendStatus(403);
  }

  try {
    await stripe.paymentMethods.attach(paymentMethod, {
      customer: customerId,
    });

    // Change the default invoice settings on the customer to the new payment method
    await stripe.customers.update(
      customerId,
      {
        name: firstname,
        phone: '9394556767',
        invoice_settings: {
          default_payment_method: paymentMethod,
        },
      }
    );

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
      expand: ['latest_invoice.payment_intent'],
    });

    if (subscription.status === 'active') {
      // insert firstname, lastname, customerId, planId, subscription.id, in database
      // Change your UI to show a success message to your customer.
      // Call your backend to grant access to your service based on
      // `result.subscription.items.data[0].price.product` the customer subscribed to.
      console.log(subscription);
    }

    res.json(subscription);

  } catch (error) {
    res.statusMessage = error.message;
    res.status(402).end();
  }
});

// Webhook listener
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;

    try {
      event = await stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );

      switch (event.type) {
        case 'invoice.paid':
          // Used to provision services after the trial has ended.
          // The status of the invoice will show up as paid. Store the status in your
          // database to reference when a user accesses your service to avoid hitting rate limits.
          break;
        case 'invoice.payment_failed':
          // If the payment fails or the customer does not have a valid payment method,
          //  an invoice.payment_failed event is sent, the subscription becomes past_due.
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
      }

      // Return a response to acknowledge receipt of the event
      res.json({ received: true });

    } catch (err) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);
module.exports = router
