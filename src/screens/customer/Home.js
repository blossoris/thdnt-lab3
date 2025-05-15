import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMyContextController } from '../../store/Index';
import { Icon } from 'react-native-paper';
import SettingStack from '../../routers/SettingStack';
import RouterAppointment from '../../routers/customer/RouterAppointment';
import RouterServiceCustomer from '../../routers/customer/RouterServiceCustomer';

const Tab = createBottomTabNavigator();

//2124802010728 - Võ Ngân Khanh
const Home = ({navigation}) => {
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
        name="RouterServiceCustomer" 
        component={RouterServiceCustomer} 
        options={{
          title: "Home",
          tabBarIcon: ({color, size}) => (
            <Icon source="home" size={size} color={color} />
          ),
          headerTitleStyle: {color: '#fff', fontWeight: 'bold'},
          headerBackground: () => (
            <View style={{flex: 1, backgroundColor: '#F25C7A'}}>
            </View>
          )
        }}
      />
      <Tab.Screen 
        name="RouterAppointment" 
        component={RouterAppointment} 
        options={{
          title: "Appointment",
          tabBarIcon: ({color, size}) => (
            <Icon source="calendar" size={size} color={color} />
          ),
          headerTitleStyle: {color: '#fff', fontWeight: 'bold'},
          headerBackground: () => (
            <View style={{flex: 1, backgroundColor: '#F25C7A'}}>
            </View>
          )
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

export default Home;    

