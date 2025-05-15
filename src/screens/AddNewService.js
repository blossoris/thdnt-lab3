import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { useMyContextController } from '../store/Index';

const AddNewService = ({ navigation }) => {
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('0');
  const [controller] = useMyContextController();
  const userLogin = controller?.userLogin;

  const handleAdd = async () => {
    if (!serviceName.trim() || !price.trim()) {
      setTimeout(() => { Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!'); }, 100);
      return;
    }
    try {
      const db = getFirestore(getApp());
      await addDoc(collection(db, 'SERVICES'), {
        name: serviceName,
        price: Number(price),
        creator: userLogin?.fullname || 'Unknown',
        time: new Date().toLocaleString('vi-VN'),
        finalUpdate: new Date().toLocaleString('vi-VN'),
        createdAt: serverTimestamp(),
      });
      setTimeout(() => {
        Alert.alert('Thành công', 'Đã thêm dịch vụ mới!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }, 100);
      setServiceName('');
      setPrice('');
      // navigation.goBack(); // hoặc navigation.navigate('Services');
    } catch (error) {
      setTimeout(() => { Alert.alert('Lỗi', 'Không thể thêm dịch vụ!'); }, 100);
      console.error(error);
    }
  };
  // 2124802010728 - Võ Ngân Khanh
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Service name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Input a service name"
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
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNewService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#F25C7A',
    padding: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginBottom: 24,
    textAlign: 'center'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10
  },
  input: {
    backgroundColor: '#F7F7FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F7F7FA'
  },
  button: {
    backgroundColor: '#F25C7A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});