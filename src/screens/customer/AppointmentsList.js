import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, query, where } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { useMyContextController } from '../../store/Index';
import { Icon } from 'react-native-paper';
const AppointmentsList = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [controller] = useMyContextController();
  const user = controller?.userLogin || {};

  useEffect(() => {
    if (!user.id) return;
    const db = getFirestore(getApp());
    const q = query(collection(db, 'TRANSACTIONS'), where('customerId', '==', user.id));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setTimeout(() => { Alert.alert('Lỗi', 'Không thể tải lịch hẹn!'); }, 100);
        console.error(error);
      }
    );
    return () => unsubscribe();
  }, [user.id]);

  const handleDelete = (id) => {
    setTimeout(() => {
      Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa lịch hẹn này?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa', style: 'destructive', onPress: async () => {
            try {
              const db = getFirestore(getApp());
              await deleteDoc(doc(db, 'TRANSACTIONS', id));
            } catch (error) {
              setTimeout(() => { Alert.alert('Lỗi', 'Không thể xóa lịch hẹn!'); }, 100);
              console.error(error);
            }
          }
        }
      ]);
    }, 100);
  };

  function parseVNDateString(timeString) {
    if (!timeString) return new Date(); // Nếu không có thời gian, trả về thời gian hiện tại
    const date = new Date(timeString);  // Chuyển chuỗi ISO thành đối tượng Date
    return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }); // Hiển thị theo định dạng Việt Nam
  }
  
  
  const handleUpdate = (appointment) => {
    navigation.navigate('UpdateAppointment', { appointment });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F25C7A" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>Dịch vụ: {item.serviceName}</Text>
        <Text>Thời gian: {parseVNDateString(item.time)}</Text>
        <Text>Trạng thái: <Text style={{ color: item.status === 'accepted' ? 'green' : 'orange' }}>{item.status || 'pending'}</Text></Text>
        <Text>Ghi chú: {item.note || ''}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.updateBtn} onPress={() => handleUpdate(item)}>
          <Text style={styles.btnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  //2124802010728 - Võ Ngân Khanh
  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa có lịch hẹn nào.</Text>}
      />
    </View>
  );
};

export default AppointmentsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
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
  actions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 8,
  },
  updateBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  deleteBtn: {
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