import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getFirestore, collection, onSnapshot, query, where } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { useMyContextController } from '../store/Index';
import { Image } from 'react-native';

const Customer = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [controller] = useMyContextController();
  const userLogin = controller?.userLogin;


  useEffect(() => {
    const db = getFirestore(getApp());
    const q = query(collection(db, 'USERS'), where('role', '==', 'customer'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setTimeout(() => { Alert.alert('Lỗi', 'Không thể tải khách hàng!'); }, 100);
        console.error(error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleUpdate = (customer) => {
    navigation.navigate('UpdateCustomer', { customer });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F25C7A" />
      </View>
    );
  }
  // 2124802010728 - Võ Ngân Khanh
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.fullname || 'N/A'}</Text>
        <Text>Email: {item.email}</Text>
        <Text>Phone: {item.phone}</Text>
        <Text>Address: {item.address}</Text>
      </View>
      <TouchableOpacity style={styles.updateBtn} onPress={() => handleUpdate(item)}>
        <Text style={styles.btnText}>Update</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={require('../images/logolab3.png')} style={styles.logo} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách khách hàng</Text>
      </View>
      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có khách hàng nào.</Text>}
      />
    </View>
  );
};

export default Customer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F7FA',
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    elevation: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  updateBtn: {
    backgroundColor: '#F25C7A',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
});