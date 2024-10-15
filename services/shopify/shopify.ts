import Client from 'shopify-buy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCheckoutStore } from '../../stores/useShopifyStore';

const client = Client.buildClient({
  domain: '0297ef-53.myshopify.com',
  storefrontAccessToken: 'cdeeeeecefb9a38b54288e286a2b0f99',
  apiVersion: '2024-04'
});

export async function fetchAllProducts() {
  try {
    const products = await client.product.fetchAll();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

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

export const addLineItems = async (checkoutId: string, lineItemsToAdd: any[]) => {
  try {
    const checkout = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
    useCheckoutStore.setState({ checkout: checkout });
  } catch (error) {
    console.error('Error adding line items:', error);
    throw error;
  }
};

export const updateLineItems = async (checkoutId: string, lineItemsToUpdate: any[]) => {
  try {
    const checkout = await client.checkout.updateLineItems(checkoutId, lineItemsToUpdate);
    useCheckoutStore.setState({ checkout: checkout });
  } catch (error) {
    console.error('Error updating line items:', error);
    throw error;
  }
};

export const removeLineItems = async (checkoutId: string, lineItemIdsToRemove: string[]) => {
  try {
    const checkout = await client.checkout.removeLineItems(checkoutId, lineItemIdsToRemove);
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
