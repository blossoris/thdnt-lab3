import { StyleSheet } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useMyContextController } from '../../store/Index'
import ServicesList from '../../screens/customer/ServicesList'
import ServiceDetail from '../../screens/customer/ServiceDetail'
import Appointment from '../../screens/customer/Appointment'
import AppointmentsList from '../../screens/customer/AppointmentsList'

const Stack = createStackNavigator()

const RouterServiceCustomer = ({ navigation }) => {
    const [controller] = useMyContextController();
    const userLogin = controller?.userLogin;

    return (
        <Stack.Navigator
            initialRouteName="ServicesList"
            screenOptions={{
                headerStyle: { backgroundColor: '#F25C7A' },
                headerTintColor: '#fff',
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="ServicesList"
                component={ServicesList}
                options={{
                    headerTitle: 'Dịch vụ',
                }}
            />
            {/* 2124802010728 - Võ Ngân Khanh */}
            <Stack.Screen
                name="ServiceDetail"
                component={ServiceDetail}
                options={{
                    headerTitle: 'Chi tiết dịch vụ',
                }}
            />

            <Stack.Screen
                name="Appointment"
                component={Appointment}
                options={{
                    headerTitle: 'Đặt lịch',
                }}
            />
        </Stack.Navigator>
    )
}

export default RouterServiceCustomer

const styles = StyleSheet.create({})