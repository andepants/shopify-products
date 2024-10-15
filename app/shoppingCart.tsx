import { StyleSheet, ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { useCheckoutStore } from '../stores/useShopifyStore';
import { useShopifyCheckoutSheet } from '@shopify/checkout-sheet-kit';
import { removeLineItems, updateLineItems } from '../services/shopify/shopify';

const transformCheckoutUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');

    // Remove the unnecessary segment (e.g., '90661552420')
    if (pathSegments.length > 3) {
      pathSegments.splice(1, 1); // Remove the second segment
    }

    // Add 'co' after 'checkouts'
    if (!pathSegments.includes('co')) {
      pathSegments.splice(2, 0, 'co');
    }

    // Reconstruct the URL
    urlObj.pathname = pathSegments.join('/');
    return urlObj.toString();
  } catch (error) {
    console.error('Error transforming URL:', error);
    return url; // Return the original URL if there's an error
  }
};

export default function ModalScreen() {
  const checkout = useCheckoutStore((state: any) => state.checkout);
  const shopifyCheckout = useShopifyCheckoutSheet();

  const openShopifyWebURL = () => {
    try {
      if (checkout && checkout.webUrl) {
        const transformedUrl = transformCheckoutUrl(checkout.webUrl);
        shopifyCheckout.present(transformedUrl);
      } else {
        console.error('Invalid checkout URL');
      }
    } catch (error) {
      console.error('Error presenting Shopify Checkout:', error);
    }
  };

  const handleRemoveItem = async (lineItemId: string) => {
    try {
      if (checkout && checkout.id) {
        await removeLineItems(checkout.id, [lineItemId]);
      }
    } catch (error) {
      console.error('Error removing line item:', error);
    }
  };

  const handleUpdateQuantity = async (lineItemId: string, quantity: number) => {
    try {
      if (checkout && checkout.id) {
        await updateLineItems(checkout.id, [{ id: lineItemId, quantity }]);
      }
    } catch (error) {
      console.error('Error updating line item quantity:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {checkout && checkout.lineItems.length !== 0 ? (
        <View>
          {checkout.lineItems.length > 0 ? (
            checkout.lineItems.map((item: any) => (
              <View key={item.id} style={styles.itemContainer}>
                <Image source={{ uri: item.variant.image.src }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text>
                    {item.variant.price.currencyCode === 'USD' ? '$' : ''}
                    {item.variant.price.amount} {checkout.totalPrice.currencyCode === 'USD' ? '' : checkout.totalPrice.currencyCode}
                  </Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                      <Text style={styles.quantityButton}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                      <Text style={styles.quantityButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                    <Text style={styles.removeButton}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>Your cart is empty!</Text>
          )}
          <Text style={styles.totalPrice}>
            Total: {checkout.totalPrice?.currencyCode === 'USD' ? '$' : ''}
            {checkout.totalPrice?.amount} {checkout.totalPrice.currencyCode === 'USD' ? '' : checkout.totalPrice.currencyCode}
          </Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={openShopifyWebURL}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
          {checkout.errors?.length > 0 && (
            <View>
              <Text style={styles.subtitle}>Errors:</Text>
              {checkout.errors.map((error: any, index: number) => (
                <Text key={index} style={styles.errorText}>{error.message}</Text>
              ))}
            </View>
          )}
        </View>
      ) : (
        <Text>Your cart is empty!</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  removeButton: {
    color: 'gray',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // Ensures the container only wraps its content
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 2,
    marginTop: 5,
  },
  quantityButton: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 14,
    marginHorizontal: 10,
  },
});
