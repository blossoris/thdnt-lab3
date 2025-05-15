import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login'
import Admin from '../screens/Admin'
import Register from '../screens/Register'  
import Home from '../screens/customer/Home'
import ForgotPassword from '../screens/ForgotPassword'
const Stack = createNativeStackNavigator()

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="Login"
    screenOptions={{
        headerShown: false
    }}
    >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  )
}
//2124802010728 - Võ Ngân Khanh

export default Router

const styles = StyleSheet.create({})