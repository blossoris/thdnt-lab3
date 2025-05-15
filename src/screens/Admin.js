import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RouterService from '../routers/RouterService';
import Transaction from './Transaction';
import { useMyContextController } from '../store/Index';
import { Icon } from 'react-native-paper';
import RouterCustomer from '../routers/RouterCustomer';
import SettingStack from '../routers/SettingStack';
const Tab = createBottomTabNavigator();
//2124802010728 - Võ Ngân Khanh
const Admin = ({navigation}) => {
  const context = useMyContextController();
  const controller = context[0];
  const userLogin = controller?.userLogin;

  return (
    <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    >
      <Tab.Screen 
        name="RouterService" 
        component={RouterService} 
        options={{
          title: "Home",
          tabBarIcon: ({color, size}) => (
            <Icon source="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Transaction" 
        component={Transaction} 
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon source="cash-check" size={size} color={color} />
          ),
          headerShown: true,
          headerStyle: { backgroundColor: '#F25C7A' },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen 
        name="RouterCustomer" 
        component={RouterCustomer} 
        options={{
          title: "Customer",
          tabBarIcon: ({color, size}) => (
            <Icon source="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="SettingStack" 
        component={SettingStack} 
        options={{
          title: "Setting",
          tabBarIcon: ({color, size}) => (
            <Icon source="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default Admin;    

