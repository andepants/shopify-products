import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TabTwoScreen() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://onji5ubwy0.execute-api.us-east-1.amazonaws.com/default/');
        const result = await response.json();
        console.log('result', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {data && <Text>{JSON.stringify(data)}</Text>}
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
});
