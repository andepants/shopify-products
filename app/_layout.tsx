import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Link, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {ShopifyCheckoutSheetProvider} from '@shopify/checkout-sheet-kit';

import { useColorScheme } from '@/components/useColorScheme';
import { Pressable, View, Text } from 'react-native';
import { useCheckoutStore } from '@/stores/useShopifyStore';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const checkout = useCheckoutStore((state: any) => state.checkout);
  const totalItemsInCart = checkout?.lineItems.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ShopifyCheckoutSheetProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="details/[id]"
            options={{
              headerShown: true, // Ensure the header is shown
              headerBackTitle: 'Back',
              headerTitle: 'Product Details',
              headerRight: () => (
                <Link href="/shoppingCart" asChild>
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
            name="shoppingCart"
            options={{
              headerBackTitle: 'Back',
              headerTitle: 'Shopping Cart', // Set the title for the shoppingCart screen
            }}
          />
        </Stack>
      </ShopifyCheckoutSheetProvider>
    </ThemeProvider>
  );
}
