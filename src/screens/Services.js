import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getFirestore, collection, onSnapshot } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { IconButton } from 'react-native-paper';  
import Icon from 'react-native-vector-icons/FontAwesome';


//2124802010728 - Võ Ngân Khanh
const Services = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore(getApp());
    const unsubscribe = onSnapshot(
      collection(db, 'SERVICES'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F25C7A" />
      </View>
    );
  }

  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
      <Image source={require('../images/logolab3.png')} style={styles.logo} />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Danh sách dịch vụ</Text>
        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('AddNewService')}> 
          <Icon name="plus" size={15} style={styles.icon}/> 
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={item => item.id}
        contentContainerStyle={services.length === 0 && {flex: 1, justifyContent: 'center'}}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ServiceDetail', { service: item })}
          >
            <Text style={styles.name}>
              {item.name.split(" ").length > 7
                ? item.name.split(" ").slice(0, 7).join(" ") + "..."
                : item.name}
            </Text>
            <Text style={styles.price}>
              {item.price?.toLocaleString('vi-VN')} ₫
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có dịch vụ nào.</Text>}
      />
    </View>
  );
};

export default Services;

const styles = StyleSheet.create({
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
    marginBottom: 8,
  },
  icon: {
    backgroundColor: '#F25C7A',
    borderRadius: 360,
    padding: 5,
    color: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#F7F7FA',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
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
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
});