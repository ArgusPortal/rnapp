import React from 'react';
import { View, Text, Button } from 'react-native-paper';
import { storeData, getData } from '../services/database';

export default function HomeScreen() {
  const handlePress = async () => {
    await storeData('testKey', { value: 'Dado salvo com sucesso!' });
    const data = await getData('testKey');
    console.log('Dado recuperado:', data);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium">Bem-vindo ao App Acadêmico</Text>
      <Button mode="contained" onPress={handlePress}>
        Testar AsyncStorage
      </Button>
    </View>
  );
}
