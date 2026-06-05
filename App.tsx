import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { BiomeDetailsScreen } from './src/screens/BiomeDetailsScreen';
import { InteractiveMapScreen } from './src/screens/InteractiveMapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Esconde o cabeçalho padrão para podermos customizar as telas inteiras
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BiomeDetails" component={BiomeDetailsScreen} />
        <Stack.Screen name="InteractiveMap" component={InteractiveMapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
