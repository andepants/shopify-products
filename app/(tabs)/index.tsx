import React, { useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native'; // Import Image component
import { Text, View } from '@/components/Themed';
import { fetchAllProducts } from '@/services/shopify/shopify'; // Import the function
import { Product } from '@/types/shopify';

export default function TabOneScreen() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await fetchAllProducts(); // Wait for products to be fetched
        setProducts(fetchedProducts as Product[]); // Set the state with the fetched products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(); // Call the async function
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {products.length > 0 ? (
        products.map((product, index) => (
          <View key={index} style={styles.productContainer}>
            <Image source={{ uri: product.images[0].src }} style={styles.productImage} />
            <Text>{product.title}</Text>
          </View>
        ))
      ) : (
        <Text>Loading products...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  productContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});
