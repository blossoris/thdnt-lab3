import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, updateDoc, getDoc } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { useMyContextController } from '../store/Index';

const UpdateProfile = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const user = controller?.userLogin || {};
  const [fullname, setFullname] = useState(user.fullname || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');

  const handleUpdate = async () => {
    if (!fullname.trim() || !phone.trim() || !address.trim()) {
      setTimeout(() => { Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!'); }, 100);
      return;
    }
    try {
      const db = getFirestore(getApp());
      const userRef = doc(db, 'USERS', user.id);
      await updateDoc(userRef, {
        fullname,
        phone,
        address,
      });
      // Lấy lại thông tin user mới nhất và cập nhật context
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        dispatch({ type: 'SET_USER_LOGIN', payload: { id: userSnap.id, ...userSnap.data() } });
      }
      setTimeout(() => {
        Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }, 100);
    } catch (error) {
      setTimeout(() => { Alert.alert('Lỗi', 'Không thể cập nhật thông tin!'); }, 100);
      console.error(error);
    }
  };
//2124802010728 - Võ Ngân Khanh
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email (không thể đổi)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#eee', color: '#888' }]}
        value={user.id}
        editable={false}
      />
      <Text style={styles.label}>Họ tên *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập họ tên"
        value={fullname}
        onChangeText={setFullname}
      />
      <Text style={styles.label}>SĐT *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Địa chỉ *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  },
  button: {
    backgroundColor: '#F25C7A',
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