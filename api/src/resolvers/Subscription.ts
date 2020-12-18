import { PubSub } from 'apollo-server';

export const pubsub = new PubSub();

export const PRODUCT_ADDED = 'PRODUCT_ADDED';
export const PRODUCT_UPDATED = 'PRODUCT_UPDATED';
export const PRODUCT_REMOVED = 'PRODUCT_REMOVED';

const Subscription = {
  productChanged: {
    // Additional event labels can be passed to asyncIterator creation
    subscribe: () =>
      pubsub.asyncIterator([PRODUCT_ADDED, PRODUCT_UPDATED, PRODUCT_REMOVED]),
  },
};

export default Subscription;
