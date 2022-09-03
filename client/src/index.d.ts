export {};

declare global {
  interface Window {
    Stripe: any;
  }
}