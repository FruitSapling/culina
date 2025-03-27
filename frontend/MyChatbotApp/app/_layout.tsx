// layout.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import ChatScreen from './ChatScreen';
import InventoryScreen from './InventoryScreen';

// Import the provider
import { InventoryProvider } from './InventoryContext';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    // Wrap the entire Tabs.Navigator in the provider
    <InventoryProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#008f68',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            title: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{
            title: 'Inventory',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="basket-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="basket-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </InventoryProvider>
  );
}
