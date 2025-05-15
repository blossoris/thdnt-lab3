import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, updateDoc } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';


// 2124802010728 - Võ Ngân Khanh
const EditService = ({ route, navigation }) => {
  const { service } = route.params;
  const [serviceName, setServiceName] = useState(service?.name || '');
  const [price, setPrice] = useState(service?.price?.toString() || '');

  const handleUpdate = async () => {
    if (!serviceName.trim() || !price.trim()) {
      setTimeout(() => { Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!'); }, 100);
      return;
    }
    try {
      const db = getFirestore(getApp());
      await updateDoc(doc(db, 'SERVICES', service.id), {
        name: serviceName,
        price: Number(price),
        finalUpdate: new Date().toLocaleString('vi-VN'),
      });
      setTimeout(() => { Alert.alert('Thành công', 'Đã cập nhật dịch vụ!'); navigation.goBack(); }, 100);
    } catch (error) {
      setTimeout(() => { Alert.alert('Lỗi', 'Không thể cập nhật dịch vụ!'); }, 100);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Service name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên dịch vụ"
        value={serviceName}
        onChangeText={setServiceName}
      />
      <Text style={styles.label}>Price *</Text>
      <TextInput
        style={styles.input}
        placeholder="0"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditService;

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