import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { fetchAllProducts } from '../../services/shopify/shopify';
import { Product } from '../../types/shopify';
import { Link } from 'expo-router';
import {useProductStore} from '../../stores/useProductStores'; // Import the zustand store
import { useRouter } from 'expo-router';

export default function TabOneScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const setProduct = useProductStore((state: any) => state.setProduct); // Access the setProduct action

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

  const handleProductPress = (product: Product) => {
    setProduct(product);
    router.push(`/details/${product.id.slice(-13)}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {products.length > 0 ? (
        products.map((product, index) => (
          <View key={index} style={styles.productContainer}>
            <TouchableOpacity onPress={() => handleProductPress(product)}>
              <Image source={{ uri: product.images[0].src }} style={styles.productImage} />
            </TouchableOpacity>
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
