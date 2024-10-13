import Client from 'shopify-buy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCheckoutStore } from '../../stores/useProductStores';

// Initializing a client to return content in the store's primary language
const client = Client.buildClient({
  domain: '0297ef-53.myshopify.com',
  storefrontAccessToken: 'cdeeeeecefb9a38b54288e286a2b0f99',
  apiVersion: '2024-04'
});

// Initializing a client to return translated content
// const clientWithTranslatedContent = Client.buildClient({
//   domain: 'your-shop-name.myshopify.com',
//   storefrontAccessToken: 'your-storefront-access-token',
//   language: 'ja-JP'
// });

// Function to fetch all products
export async function fetchAllProducts() {
  try {
    const products = await client.product.fetchAll();
    // console.log('products', products[0]);
    return products; // Return the products for further use
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw the error if you want to handle it elsewhere
  }
}

// Create an empty checkout
export const createCheckout = async () => {
  try {
    const existingCheckout = await AsyncStorage.getItem('checkout');
    if (existingCheckout) {
      const parsedCheckout = JSON.parse(existingCheckout);
      const checkoutId = parsedCheckout.id;

      // Fetch the existing checkout
      const checkout = await client.checkout.fetch(checkoutId);
      // update checkoutStore
      useCheckoutStore.setState({ checkout: checkout });
      console.log('Fetched existing checkout: ');
      return checkout;
    }

    // Create a new checkout if none exists
    const checkout = await client.checkout.create();
    console.log('New checkout created:');

    // Store the new checkout in AsyncStorage
    await AsyncStorage.setItem('checkout', JSON.stringify(checkout));
    useCheckoutStore.setState({ checkout: checkout });
    return checkout;
  } catch (error) {
    console.error('Error creating or retrieving checkout:', error);
    throw error; // Re-throw the error if you want to handle it elsewhere
  }
};

// client.checkout.fetch(checkoutId).then((checkout) => {
//   // Do something with the checkout
//   console.log(checkout);
// });

// Add an item to the checkout
export const addLineItems = async (checkoutId: string, lineItemsToAdd: any[]) => {
  try {
    const checkout = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
    await AsyncStorage.setItem('checkout', JSON.stringify(checkout));
    useCheckoutStore.setState({ checkout: checkout });
    // console.log('Added line items:', checkout.lineItems);
  } catch (error) {
    console.error('Error adding line items:', error);
    throw error;
  }
};

// Update the line item on the checkout (change the quantity or variant)
export const updateLineItems = (checkoutId: string, lineItemsToUpdate: any[]) => {
  client.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then((checkout) => {
  // Do something with the updated checkout
    console.log(checkout.lineItems); // Quantity of line item 'gid://shopify/Product/7857989384' updated to 2
  });
};

// Remove an item from the checkout
export const removeLineItems = (checkoutId: string, lineItemIdsToRemove: string[]) => {
  client.checkout.removeLineItems(checkoutId, lineItemIdsToRemove).then((checkout) => {
  // Do something with the updated checkout
    console.log(checkout.lineItems); // Checkout with line item 'gid://shopify/CheckoutLineItem/194677729198640?checkout=e3bd71f7248c806f33725a53e33931ef' removed
  });
};



export async function fetchAllCollectionsWithProducts() {
  try {
    const collections = await client.collection.fetchAllWithProducts();
    // return the first collection's products, will have to update if there is more collections
    return collections[0].products;
  } catch (error) {
    console.error('Error fetching collections with products:', error);
    throw error; // Re-throw the error if you want to handle it elsewhere
  }
}

// Function to fetch a single product by ID
export function fetchProductById(productId: string) {
  return client.product.fetch(productId).then((product) => {
    // Do something with the product
    console.log(product);
  });
}

// Function to fetch a single product by Handle
export function fetchProductByHandle(handle: string) {
  return client.product.fetchByHandle(handle).then((product) => {
    // Do something with the product
    console.log(product);
  });
}
