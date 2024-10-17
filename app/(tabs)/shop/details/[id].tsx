import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useProductStore } from '../../../../stores/useShopifyStore';
import { addLineItems } from '../../../../services/shopify/shopify';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useCheckoutStore } from '../../../../stores/useShopifyStore';

const Details = () => {
  const product = useProductStore((state: any) => state.product);
  const router = useRouter();
  const [isWaitlist, setIsWaitlist] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const checkout = useCheckoutStore((state: any) => state.checkout);

  useEffect(() => {
    if (!product.availableForSale) {
      setIsWaitlist(true);
    }
  }, [product]);

  if (!product) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  const handleAddToCart = async () => {
    const lineItemsToAdd = [
      {
        variantId: product.variants[0].id,
        quantity: 1,
        customAttributes: []
      }
    ];
    addLineItems(checkout.id, lineItemsToAdd);
    router.push('../shoppingCart');
  };

  const handleJoinWaitlist = () => {
    setModalVisible(true);
  };

  const handleJoinWaitlistSubmit = () => {
    console.log('Email submitted:', email);
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{product.title}</Text>
      <Image
        source={{ uri: product.images[0].src }}
        style={styles.image}
        resizeMode="cover"
      />
      {!isWaitlist && (
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.variants[0].price.amount}</Text>
          <Text style={styles.compareAtPrice}>${product.variants[0].compareAtPrice.amount}</Text>
        </View>
      )}
      <Text style={styles.description}>{product.description}</Text>

      {isWaitlist ? (
        <TouchableOpacity style={styles.waitlistButton} onPress={handleJoinWaitlist}>
          <Text style={styles.waitlistButtonText}>Join Waitlist</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>COMING SOON</Text>
            <Text style={styles.modalSubtitle}>Join the waitlist to get notified once we launch.</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleJoinWaitlistSubmit}>
              <Text style={styles.modalButtonText}>JOIN THE WAITLIST</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
              By signing up, you agree to our{' '}
              <Text
                style={styles.privacyPolicyLink}
                onPress={() => Linking.openURL('https://blueprint.bryanjohnson.com/policies/privacy-policy')}
              >
                privacy policy.
              </Text>
            </Text>
          </View>
        </View>
      </Modal>
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
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
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
    marginVertical: 15,
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
    marginBottom: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  waitlistButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  waitlistButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  privacyPolicyLink: {
    color: '#007bff',
  },
});

export default Details;
