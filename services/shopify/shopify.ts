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
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
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
      useCheckoutStore.setState({ checkout: checkout });
      return checkout;
    }

    // Create a new checkout if none exists
    const checkout = await client.checkout.create();
    await AsyncStorage.setItem('checkout', JSON.stringify(checkout));
    useCheckoutStore.setState({ checkout: checkout });
    return checkout;
  } catch (error) {
    console.error('Error creating or retrieving checkout:', error);
    throw error;
  }
};

// Add an item to the checkout
export const addLineItems = async (checkoutId: string, lineItemsToAdd: any[]) => {
  try {
    const checkout = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
    await AsyncStorage.setItem('checkout', JSON.stringify(checkout));
    useCheckoutStore.setState({ checkout: checkout });
  } catch (error) {
    console.error('Error adding line items:', error);
    throw error;
  }
};

// Update the line item on the checkout (change the quantity or variant)
export const updateLineItems = async (checkoutId: string, lineItemsToUpdate: any[]) => {
  try {
    const checkout = await client.checkout.updateLineItems(checkoutId, lineItemsToUpdate);
    // console.log(checkout.lineItems);
    await AsyncStorage.setItem('checkout', JSON.stringify(checkout));
    useCheckoutStore.setState({ checkout: checkout });
  } catch (error) {
    console.error('Error updating line items:', error);
    throw error;
  }
};

// Remove an item from the checkout
export const removeLineItems = async (checkoutId: string, lineItemIdsToRemove: string[]) => {
  try {
    const checkout = await client.checkout.removeLineItems(checkoutId, lineItemIdsToRemove);
    // console.log(checkout.lineItems);
    await AsyncStorage.setItem('checkout', JSON.stringify(checkout));
    useCheckoutStore.setState({ checkout: checkout });
  } catch (error) {
    console.error('Error removing line items:', error);
    throw error;
  }
};

export async function fetchAllCollectionsWithProducts() {
  try {
    const collections = await client.collection.fetchAllWithProducts();
    return collections[0].products;
  } catch (error) {
    console.error('Error fetching collections with products:', error);
    throw error;
  }
}

// Function to fetch a single product by ID
export async function fetchProductById(productId: string) {
  try {
    const product = await client.product.fetch(productId);
    console.log(product);
    return product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

// Function to fetch a single product by Handle
export async function fetchProductByHandle(handle: string) {
  try {
    const product = await client.product.fetchByHandle(handle);
    console.log(product);
    return product;
  } catch (error) {
    console.error('Error fetching product by handle:', error);
    throw error;
  }
}
