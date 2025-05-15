import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Setting from '../screens/Setting';
import UpdateProfile from '../screens/UpdateProfile';
import ChangePassword from '../screens/ChangePassword';
import { useMyContextController } from '../store/Index';
const Stack = createNativeStackNavigator();

export default function SettingStack() {
  const context = useMyContextController();
  const controller = context[0];
  const userLogin = controller?.userLogin;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Setting" 
        component={Setting} 
        options={{ title: 'Setting',
          headerShown: true,
          headerStyle: { backgroundColor: '#F25C7A' },
          headerTintColor: '#fff',
      }} 
      />
      <Stack.Screen name="UpdateProfile" 
      component={UpdateProfile} 
      options={{ title: 'Update Profile',
        headerShown: true,
        headerStyle: { backgroundColor: '#F25C7A' },
        headerTintColor: '#fff',
      }} 
      />
      <Stack.Screen name="ChangePassword" 
      component={ChangePassword} 
      options={{ title: 'Change Password',
        headerShown: true,
        headerStyle: { backgroundColor: '#F25C7A' },
        headerTintColor: '#fff',
      }} />
    </Stack.Navigator>
  );
} 
//2124802010728 - Võ Ngân Khanh