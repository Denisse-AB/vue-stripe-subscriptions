"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express_1.default.Router();
dotenv_1.default.config();
// Your Db connection
router.post('/create-customer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullname, address, city, zipCode, state } = req.body;
    // validation
    if (!email && !fullname && !address && !city && !zipCode && !state) {
        return res.sendStatus(400);
    }
    try {
        const customer = yield stripe.customers.create({
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
        });
        if (customer) {
            // save the customer.id in your database.
            return res.json({ customer: customer });
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}));
router.post('/create-subscription', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId, priceId } = req.body;
    if (!customerId && !priceId) {
        return res.sendStatus(403);
    }
    try {
        const subscription = yield stripe.subscriptions.create({
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
    }
    catch (error) {
        return res.sendStatus(400);
    }
}));
// Changes to a subscription can result in prorated charges
// Learn about prorations: https://stripe.com/docs/billing/subscriptions/prorations
router.post('/update-subscription', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield stripe.subscriptions.retrieve(req.body.subscriptionId);
    const updatedSubscription = yield stripe.subscriptions.update(req.body.subscriptionId, {
        cancel_at_period_end: false,
        items: [
            {
                id: subscription.items.data[0].id,
                price: req.body.priceId,
            },
        ],
        proration_behavior: 'none',
    });
    res.send(updatedSubscription);
}));
router.post('/delete-subscription', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedSubscription = yield stripe.subscriptions.del(req.body.subscriptionId);
        res.send(deletedSubscription);
    }
    catch (error) {
        return res.sendStatus(400);
    }
}));
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let event;
    try {
        event = yield stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
        // Extract the object from the event.
        const dataObject = event.data.object;
        if (dataObject['billing_reason'] == 'subscription_create') {
            const subscription_id = dataObject['subscription'];
            const payment_intent_id = dataObject['payment_intent'];
            // Retrieve the payment intent used to pay the subscription
            const payment_intent = yield stripe.paymentIntents.retrieve(payment_intent_id);
            yield stripe.subscriptions.update(subscription_id, {
                default_payment_method: payment_intent.payment_method,
            });
            yield stripe.customers.update(payment_intent.customer, {
                invoice_settings: {
                    default_payment_method: payment_intent.payment_method,
                },
            });
        }
        ;
        switch (event.type) {
            case 'invoice.paid':
                // Used to provision services after the trial has ended.
                // The status of the invoice will show up as paid. Store the status in your
                // database to reference when a user accesses your service to avoid hitting rate limits.
                // status paid
                console.log('Invoice.paid: ' + dataObject.status);
                break;
            case 'invoice.payment_succeeded':
                // Insert payment succeeded into the database
                // Allowed access to your service
                // status paid
                console.log('payment_succeeded: ' + dataObject.status);
                break;
            case 'invoice.payment_failed':
                // If the payment fails or the customer does not have a valid payment method,
                // an invoice.payment_failed event is sent, the subscription becomes past_due.
                // Use this webhook to notify your user that their payment has
                // failed and to retrieve new card details.
                // status open
                console.log('invoice.payment_failed: ' + dataObject.status);
                break;
            case 'customer.subscription.created':
                // Insert active into database and grant access to service
                // status active
                console.log('customer.subscription.created: ' + dataObject.status);
                break;
            case 'customer.subscription.updated':
                // Insert active into database and grant access to service
                // status active
                console.log('customer.subscription.updated: ' + dataObject.status);
                break;
            case 'customer.subscription.deleted':
                if (event.request != null) {
                    // handle a subscription cancelled by request
                    // from above.
                    // status canceled
                    console.log('customer.subscription.deleted: ' + dataObject.status);
                }
                else {
                    // handle subscription cancelled automatically based
                    // upon subscription settings.
                    // status canceled
                    console.log('customer.subscription.deleted: ' + dataObject.status);
                }
                break;
            default:
            // Unexpected event type
        }
        // Return a response to acknowledge receipt of the event
        res.sendStatus(200);
    }
    catch (err) {
        // On error, log and return the error message
        console.log(`❌ Error message: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
}));
module.exports = router;
