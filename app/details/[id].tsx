import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useProductStore } from '../../stores/useProductStores';
import { addLineItems } from '../../services/shopify/shopify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Details = () => {
  const product = useProductStore((state: any) => state.product);
  const router = useRouter();

  if (!product) {
    return <Text style={styles.loadingText}>Loading...</Text>; // Handle the case where the product is not yet set
  }

  const handleAddToCart = async () => {
    const existingCheckout = await AsyncStorage.getItem('checkout');
    const lineItemsToAdd = [
      {
        variantId: product.variants[0].id,
        quantity: 1,
        customAttributes: []
      }
    ]
    if (existingCheckout) {
      const parsedCheckout = JSON.parse(existingCheckout);
      const checkoutId = parsedCheckout.id;
      addLineItems(checkoutId, lineItemsToAdd);
      router.push('/shoppingCart');
    } else {
      console.log('No existing checkout found');
    }

  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.vendor}>by {product.vendor}</Text>
      <Image
        source={{ uri: product.images[0].src }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.availability}>
        {product.availableForSale ? 'Available for Sale' : 'Not Available'}
      </Text>
      <Text style={styles.variantTitle}>Variant: {product.variants[0].title}</Text>
      <Text style={styles.weight}>Weight: {product.variants[0].weight} kg</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${product.variants[0].price.amount}</Text>
        <Text style={styles.compareAtPrice}>${product.variants[0].compareAtPrice.amount}</Text>
      </View>
      <Text style={styles.description}>{product.description}</Text>
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  vendor: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  availability: {
    fontSize: 16,
    color: '#28a745',
    marginBottom: 10,
  },
  variantTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  weight: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
  compareAtPrice: {
    fontSize: 18,
    color: '#d9534f',
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginTop: 15,
    lineHeight: 22,
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Details;