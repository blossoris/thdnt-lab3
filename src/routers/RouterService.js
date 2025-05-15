import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useMyContextController } from '../store/Index'
import Services from '../screens/Services'
import AddNewService from '../screens/AddNewService'
import ServiceDetail from '../screens/ServiceDetail'
import EditService from '../screens/EditService'
import Setting from '../screens/Setting'
import { IconButton } from 'react-native-paper'
const Stack = createStackNavigator()

const RouterService = () => {
    const context = useMyContextController();
    const controller = context[0];
    const userLogin = controller?.userLogin;
    //2124802010728 - Võ Ngân Khanh
    return (
        <Stack.Navigator initialRouteName="Services">
            <Stack.Screen
                name="Services"
                component={Services}
                options={{
                    headerTitle: userLogin?.fullname || 'Services',
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#F25C7A' },
                    headerTintColor: '#fff',
                    headerRight: () => <IconButton icon="account" color="white"/>,
                }}
            />
            <Stack.Screen
                name="AddNewService"
                component={AddNewService}
                options={{
                    headerTitle: 'Service',
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#F25C7A' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="ServiceDetail"
                component={ServiceDetail}
                options={{
                    headerTitle: 'Service Detail',
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#F25C7A' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="EditService"
                component={EditService}
                options={{
                    headerTitle: 'Service Detail',
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