import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useMyContextController } from '../store/Index'
import Customer from '../screens/Customer'
import UpdateCustomer from '../screens/UpdateCustomer'
import { IconButton } from 'react-native-paper'
//2124802010728 - Võ Ngân Khanh
const Stack = createStackNavigator()

const RouterService = () => {
    const context = useMyContextController();
    const controller = context[0];
    const userLogin = controller?.userLogin;

    return (
        <Stack.Navigator initialRouteName="Customer">
            <Stack.Screen
                name="Customer"
                component={Customer}
                options={{
                    headerTitle: 'Customer',
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#F25C7A' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="UpdateCustomer"
                component={UpdateCustomer}
                options={{
                    headerTitle: 'Customer',
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#F25C7A' },
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    )
}

export default RouterService

const styles = StyleSheet.create({})