import React from 'react';
import { Link, Stack } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { useCheckoutStore } from '@/stores/useShopifyStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ShopLayout() {
  const checkout = useCheckoutStore((state: any) => state.checkout);
  const totalItemsInCart = checkout?.lineItems.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: 'Shop',headerRight: () => (
            <Link href="/shop/shoppingCart" asChild>
              <Pressable>
                {({ pressed }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 5, fontSize: 16 }}>
                      {totalItemsInCart}
                    </Text>
                    <FontAwesome
                      name="shopping-cart"
                      size={20}
                      style={{ marginRight: 0, opacity: pressed ? 0.5 : 1 }}
                    />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          headerBackTitle: 'Back',
          headerShown: true, // Ensure the header is shown
          headerTitle: 'Product Details',
          headerRight: () => (
            <Link href="/shop/shoppingCart" asChild>
              <Pressable>
                {({ pressed }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 5, fontSize: 16 }}>
                      {totalItemsInCart}
                    </Text>
                    <FontAwesome
                      name="shopping-cart"
                      size={20}
                      style={{ marginRight: 0, opacity: pressed ? 0.5 : 1 }}
                    />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="shoppingCart"
        options={{
          headerShown: true,
          headerBackTitle: 'Back',
          headerTitle: 'Shopping Cart', // Set the title for the shoppingCart screen
        }}
      />
    </Stack>
  );
}