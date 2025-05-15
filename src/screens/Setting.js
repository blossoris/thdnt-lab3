import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { logout, useMyContextController } from '../store/Index';


//2124802010728 - Võ Ngân Khanh
const Setting = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const user = controller?.userLogin || {};
  const userLogin = controller?.userLogin;
  const handleLogout = async () => {
    try {
      await logout(dispatch);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    if(userLogin==null){
      navigation.replace('Login');
    }
  }, [userLogin]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Họ tên: <Text style={styles.value}>{user.fullname ||'N/A'}</Text></Text>
        <Text style={styles.label}>Email: <Text style={styles.value}>{user.id || 'N/A'}</Text></Text>
        <Text style={styles.label}>SĐT: <Text style={styles.value}>{user.phone || 'N/A'}</Text></Text>
        <Text style={styles.label}>Địa chỉ: <Text style={styles.value}>{user.address || 'N/A'}</Text></Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateProfile')}>
        <Text style={styles.buttonText}>Cập nhật thông tin</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#F25C7A',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#F7F7FA',
    borderRadius: 10,
    padding: 16,
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  value: {
    fontWeight: 'normal',
    color: '#222',
  },
  button: {
    backgroundColor: '#F25C7A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});