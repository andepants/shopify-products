import Client from 'shopify-buy';

// Initializing a client to return content in the store's primary language
const client = Client.buildClient({
  domain: '0297ef-53.myshopify.com',
  storefrontAccessToken: '99980f465b1012db68289115fd99b0ec',
  apiVersion: '2024-10'
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
    // console.log('products', products[0].images[0]);
    return products; // Return the products for further use
  } catch (error) {
    console.error('Error fetching products:', error);
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

// Example usage
// fetchAllProducts();
// fetchProductById('gid://shopify/Product/7857989384');
// fetchProductByHandle('product-handle');

