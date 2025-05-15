import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from '@react-native-firebase/auth';
import { useMyContextController } from '../store/Index';

const ChangePassword = ({ navigation }) => {
  const [controller] = useMyContextController();
  const user = controller?.userLogin || {};
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setTimeout(() => { Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!'); }, 100);
      return;
    }
    if (newPassword.length < 6) {
      setTimeout(() => { Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự!'); }, 100);
      return;
    }
    if (newPassword !== confirmPassword) {
      setTimeout(() => { Alert.alert('Lỗi', 'Mật khẩu mới không khớp!'); }, 100);
      return;
    }
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      setTimeout(() => {
        Alert.alert('Thành công', 'Đã đổi mật khẩu!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }, 100);
    } catch (error) {
      setTimeout(() => { Alert.alert('Lỗi', 'Mật khẩu cũ không đúng hoặc có lỗi xảy ra!'); }, 100);
      console.error(error);
    }
  };
  // 2124802010728 - Võ Ngân Khanh
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mật khẩu cũ *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu cũ"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
      />
      <Text style={styles.label}>Mật khẩu mới *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Text style={styles.label}>Nhập lại mật khẩu mới *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    color: 'black'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F7F7FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F7F7FA',
    color: 'black'
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 