import { StyleSheet } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useMyContextController } from '../../store/Index'
import AppointmentsList from '../../screens/customer/AppointmentsList'
import UpdateAppointment from '../../screens/customer/UpdateAppointment'

const Stack = createStackNavigator()

const RouterAppointment = ({ navigation }) => {
    const [controller] = useMyContextController();
    const userLogin = controller?.userLogin;

    return (
        <Stack.Navigator
            initialRouteName="AppointmentsList"
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
                name="AppointmentsList"
                component={AppointmentsList}
                options={{
                    headerTitle: 'Lịch hẹn của tôi',
                }}
            />
{/* 2124802010728 - Võ Ngân Khanh         */}
            <Stack.Screen
                name="UpdateAppointment"
                component={UpdateAppointment}
                options={{
                    headerTitle: 'Cập nhật lịch hẹn',
                }}
            />
        </Stack.Navigator>
    )
}

export default RouterAppointment

const styles = StyleSheet.create({})