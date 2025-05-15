import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Icon } from 'react-native-paper';
import { getFirestore, collection, onSnapshot } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

const ServicesList = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const db = getFirestore(getApp());
    const unsubscribe = onSnapshot(
      collection(db, 'SERVICES'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        console.error('Error loading services:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ServiceDetail', { service: item })}>
      <Text style={styles.name}>
        {item.name.split(" ").length > 7
          ? item.name.split(" ").slice(0, 7).join(" ") + "..."
          : item.name}
      </Text>
      <Text style={styles.price}>{item.price?.toLocaleString('vi-VN')} ₫</Text>
    </TouchableOpacity>
  );
  //2124802010728 - Võ Ngân Khanh
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F25C7A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../images/logolab3.png')} style={styles.logo} />

      
      <View style={styles.searchContainer}>
      <Icon source="magnify" size={24} color="#888" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm dịch vụ theo tên..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />
    </View>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Danh sách dịch vụ</Text>
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy dịch vụ nào.</Text>}
      />
    </View>
  );
};

export default ServicesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  logo: {
    alignSelf: 'center',
    marginVertical: 16,
    resizeMode: 'contain',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 45,
    marginVertical: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#F7F7FA',
    borderRadius: 8,
    marginVertical: 6,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  price: {
    color: '#F25C7A',
    fontWeight: 'bold',
    fontSize: 15,
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