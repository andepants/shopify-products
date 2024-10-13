import { StyleSheet, ScrollView, Text, View, Image } from 'react-native';
import { useCheckoutStore } from '../stores/useProductStores';

export default function ModalScreen() {
  const checkout = useCheckoutStore((state: any) => state.checkout);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout Details</Text>
      {checkout ? (
        <View>
          <Text>ID: {checkout.id}</Text>
          <Text>Created At: {new Date(checkout.createdAt).toLocaleString()}</Text>
          <Text>Currency: {checkout.currencyCode}</Text>
          <Text>Total Price: {checkout.totalPrice?.amount} {checkout.totalPrice.currencyCode}</Text>
          <Text>Payment Due: {checkout.paymentDue.amount} {checkout.paymentDue.currencyCode}</Text>
          <Text>Requires Shipping: {checkout.requiresShipping ? 'Yes' : 'No'}</Text>
          <Text>Web URL: {checkout.webUrl}</Text>
          <Text style={styles.subtitle}>Line Items:</Text>
          {checkout.lineItems.length > 0 ? (
            checkout.lineItems.map((item: any) => (
              <View key={item.id} style={styles.itemContainer}>
                <Image source={{ uri: item.variant.image.src }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text>Qty: {item.quantity}</Text>
                  <Text>Price: {item.variant.price.amount} {item.variant.price.currencyCode}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text>No line items in the checkout</Text>
          )}
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
        <Text>No checkout data available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
});
