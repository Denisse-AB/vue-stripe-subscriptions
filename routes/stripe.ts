import dotenv from "dotenv";
import express from "express";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router()

dotenv.config();

// Your Db connection

router.post('/create-customer', async (req, res) => {
  const { email, fullname, address, city, zipCode, state } = req.body;

  // validation
  if (!email && !fullname && !address && !city && !zipCode && !state) {
    return res.sendStatus(400);
  }

  try {
    const customer = await stripe.customers.create({
      email: email,
      name: fullname,
      shipping: {
        address: {
          city: city,
          country: 'US',
          line1: address,
          postal_code: zipCode,
          state: state,
        },
        name: fullname,
      },
      address: {
        city: city,
        country: 'US',
        line1: address,
        postal_code: zipCode,
        state: state,
      },
    })

    if (customer) {
      // save the customer.id in your database.
      return res.json({ customer: customer });
    }

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

router.post('/create-subscription', async (req, res) => {
  const { customerId, priceId } = req.body;

  if (!customerId && !priceId) {
    return res.sendStatus(403);
  }

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });

  } catch (error) {
    return res.sendStatus(400)
  }
});
// Changes to a subscription can result in prorated charges
// Learn about prorations: https://stripe.com/docs/billing/subscriptions/prorations
router.post('/update-subscription', async (req, res) => {
  const subscription = await stripe.subscriptions.retrieve(
    req.body.subscriptionId
  );
  const updatedSubscription = await stripe.subscriptions.update(
    req.body.subscriptionId,
    {
      cancel_at_period_end: false,
      items: [
        {
          id: subscription.items.data[0].id,
          price: req.body.priceId,
        },
      ],
      proration_behavior: 'none',
    }
  )
  res.send(updatedSubscription);
});

router.post('/delete-subscription', async (req, res) => {
  try {
    const deletedSubscription = await stripe.subscriptions.del(
      req.body.subscriptionId
    );
    res.send(deletedSubscription);

  } catch (error) {
    return res.sendStatus(400)
  }
});

router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {

    let event;

    try {
      event = await stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        process.env.STRIPE_WEBHOOK_SECRET
      );
      // Extract the object from the event.
      const dataObject = event.data.object;

      if (dataObject['billing_reason'] == 'subscription_create') {
        const subscription_id = dataObject['subscription']
        const payment_intent_id = dataObject['payment_intent']

        // Retrieve the payment intent used to pay the subscription
        const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

        await stripe.subscriptions.update(
          subscription_id,
          {
            default_payment_method: payment_intent.payment_method,
          },
        );

        await stripe.customers.update(
          payment_intent.customer,
          {
            invoice_settings: {
              default_payment_method: payment_intent.payment_method,
            },
          }
        );
      };

      switch (event.type) {
        case 'invoice.paid':
          // Used to provision services after the trial has ended.
          // The status of the invoice will show up as paid. Store the status in your
          // database to reference when a user accesses your service to avoid hitting rate limits.
          // status paid
          console.log('Invoice.paid: '+dataObject.status);
          break;
        case 'invoice.payment_succeeded':
          // Insert payment succeeded into the database
          // Allowed access to your service
          // status paid
          console.log('payment_succeeded: '+dataObject.status);
          break;
        case 'invoice.payment_failed':
          // If the payment fails or the customer does not have a valid payment method,
          // an invoice.payment_failed event is sent, the subscription becomes past_due.
          // Use this webhook to notify your user that their payment has
          // failed and to retrieve new card details.
          // status open
          console.log('invoice.payment_failed: '+dataObject.status);
          break;
        case 'customer.subscription.created':
          // Insert active into database and grant access to service
          // status active
          console.log('customer.subscription.created: '+dataObject.status);
          break;
        case 'customer.subscription.updated':
          // Insert active into database and grant access to service
          // status active
          console.log('customer.subscription.updated: '+dataObject.status);
        break;
        case 'customer.subscription.deleted':
          if (event.request != null) {
            // handle a subscription cancelled by request
            // from above.
            // status canceled
            console.log('customer.subscription.deleted: '+dataObject.status);
          } else {
            // handle subscription cancelled automatically based
            // upon subscription settings.
            // status canceled
            console.log('customer.subscription.deleted: ' +dataObject.status);
          }
          break;
        default:
          // Unexpected event type
      }

      // Return a response to acknowledge receipt of the event
      res.sendStatus(200);

    } catch (err:any) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);
module.exports = router
