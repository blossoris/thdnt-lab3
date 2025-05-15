import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFirestore, doc, deleteDoc } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

//2124802010728 - Võ Ngân Khanh
const ServiceDetail = ({ route }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const { service } = route.params || {};

  const data = service || {
    name: 'Chăm sóc da mặt và dưỡng ẩm tự nhiên',
    price: 250000,
    creator: 'Hung',
    time: '12/03/2023 22:56:59',
    finalUpdate: '12/03/2023 22:56:59',
  };

  const formatCurrency = (value) =>
    value.toLocaleString('vi-VN') + ' ₫';

  const handleDelete = async () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa dịch vụ này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = getFirestore(getApp());
              await deleteDoc(doc(db, 'SERVICES', service.id));
              setTimeout(() => { Alert.alert('Thành công', 'Đã xóa dịch vụ!'); navigation.goBack(); }, 100);
            } catch (error) {
              setTimeout(() => { Alert.alert('Lỗi', 'Không thể xóa dịch vụ!'); }, 100);
              console.error(error);
            }
          },
        },
      ],
    );
    setMenuVisible(false);
  };

  const handleEdit = () => {
    navigation.navigate('EditService', { service });
    setMenuVisible(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 15 }}>
          <Icon name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>
        <Text style={styles.label}>Service name: </Text>
        <Text>{data.name}</Text>
      </Text>
      <Text style={{ marginTop: 10 }}>
        <Text style={styles.label}>Price: </Text>
        <Text>{formatCurrency(data.price)}</Text>
      </Text>
      <Text style={{ marginTop: 10 }}>
        <Text style={styles.label}>Creator: </Text>
        <Text>{data.creator}</Text>
      </Text>
      <Text style={{ marginTop: 10 }}>
        <Text style={styles.label}>Time: </Text>
        <Text>{data.time}</Text>
      </Text>
      <Text style={{ marginTop: 10 }}>
        <Text style={styles.label}>Final update: </Text>
        <Text>{data.finalUpdate}</Text>
      </Text>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Icon name="edit" size={24} color="#000" />
              <Text style={styles.menuText}>Chỉnh sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Icon name="delete" size={24} color="#FF3B30" />
              <Text style={[styles.menuText, { color: '#FF3B30' }]}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ServiceDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 200,
    position: 'absolute',
    top: 60,
    right: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
});