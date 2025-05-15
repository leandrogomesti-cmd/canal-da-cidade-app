// app/tabs/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TabBarBackground from '../../components/ui/TabBarBackground';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = '#0096c7'; // Cor azul explícita para estado ativo
  const inactiveColor = '#666666'; // Cor cinza para estado inativo

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        // Removendo o TabBarBackground para testar se ele está causando problemas
        // tabBarBackground: TabBarBackground,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e2e2',
          height: 60,
          paddingBottom: 5,
        },
      }}>
      
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={28} 
              name={focused ? "home" : "home-outline"} 
              color={color} 
            />
          ),
          tabBarLabel: 'Home'
        }}
      />

      <Tabs.Screen
        name="enviar-ocorrencia"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="vereadores"
        options={{
          title: 'Enviar ocorrência',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={28} 
              name={focused ? "add-circle" : "add-circle-outline"} 
              color={color} 
            />
          ),
          tabBarLabel: 'Enviar ocorrência'
        }}
      />

      <Tabs.Screen
        name="ver-ocorrencias"
        options={{
          title: 'Ver ocorrências',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={28} 
              name={focused ? "list" : "list-outline"} 
              color={color} 
            />
          ),
          tabBarLabel: 'Ver ocorrências'
        }}
      />

      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={28} 
              name={focused ? "cart" : "cart-outline"} 
              color={color} 
            />
          ),
          tabBarLabel: 'Marketplace'
        }}
      />
    </Tabs>
  );
}