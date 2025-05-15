import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, updateDoc } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
//2124802010728 - Võ Ngân Khanh
const UpdateCustomer = ({ route, navigation }) => {
  const { customer } = route.params;
  const [fullname, setFullname] = useState(customer?.fullname || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [address, setAddress] = useState(customer?.address || '');

  const handleUpdate = async () => {
    if (!fullname.trim() || !phone.trim() || !address.trim()) {
      setTimeout(() => { Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!'); }, 100);
      return;
    }
    try {
      const db = getFirestore(getApp());
      await updateDoc(doc(db, 'USERS', customer.id), {
        fullname,
        phone,
        address,
      });
      setTimeout(() => { Alert.alert('Thành công', 'Đã cập nhật thông tin khách hàng!'); navigation.goBack(); }, 100);
    } catch (error) {
      setTimeout(() => { Alert.alert('Lỗi', 'Không thể cập nhật thông tin!'); }, 100);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập họ tên"
        value={fullname}
        onChangeText={setFullname}
      />
      <Text style={styles.label}>Phone *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateCustomer;

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