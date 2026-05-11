import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from '../screens/MenuScreen';
import DishDetailScreen from '../screens/DishDetailScreen';
import { COLORS } from '../styles/globalStyles';

const Stack = createStackNavigator();

const MenuStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DishDetail"
        component={DishDetailScreen}
        options={({ route }) => ({
          title: route.params?.dishName || 'Detalle del Plato',
          headerBackTitle: 'Menú',
        })}
      />
    </Stack.Navigator>
  );
};

export default MenuStackNavigator;
