import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, Modal, TextInput, Platform, Image
} from 'react-native';
import { getFirestore, collection, onSnapshot, doc, updateDoc } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const Transaction = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editedData, setEditedData] = useState({
    customer: '',
    serviceName: '',
    time: '',
    note: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const db = getFirestore(getApp());
    const unsubscribe = onSnapshot(
      collection(db, 'TRANSACTIONS'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setTimeout(() => { Alert.alert('Lỗi', 'Không thể tải giao dịch!'); }, 100);
        console.error(error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAccept = async (id) => {
    try {
      const db = getFirestore(getApp());
      await updateDoc(doc(db, 'TRANSACTIONS', id), { status: 'accepted' });
      setTimeout(() => { Alert.alert('Thành công', 'Đã duyệt giao dịch!'); }, 100);
    } catch (error) {
      setTimeout(() => { Alert.alert('Lỗi', 'Không thể duyệt giao dịch!'); }, 100);
      console.error(error);
    }
  };

  //Cập nhật giao dịch
  const handleUpdate = (transaction) => {
    setSelectedTransaction(transaction);
    const time = transaction.time || transaction.appointmentTime || '';
    const date = time ? new Date(time) : new Date();
    setSelectedDate(date);
    setEditedData({
      customer: transaction.customer || '',
      serviceName: transaction.serviceName || '',
      time: time,
      note: transaction.note || ''
    });
    setModalVisible(true);
  };


  const showDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: 'date',
      is24Hour: true,
      onChange: (event, date) => {
        if (date) {
          // Sau khi chọn ngày, tiếp tục chọn giờ
          const updatedDate = new Date(date);
          showTimePickerAndroid(updatedDate);
        }
      }
    });
  };

  //Chọn giờ
  const showTimePickerAndroid = (date) => {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'time',
      is24Hour: true,
      onChange: (event, time) => {
        if (time) {
          const updatedDate = new Date(date);
          updatedDate.setHours(time.getHours());
          updatedDate.setMinutes(time.getMinutes());
          setSelectedDate(updatedDate);
          setEditedData(prev => ({ ...prev, time: updatedDate.toISOString() }));
        }
      }
    });
  };
  
  //Chọn ngày
  const handleDatePress = () => {
    if (Platform.OS === 'android') {
      showDatePickerAndroid();
    } else {
      setShowDatePicker(true); // iOS dùng mặc định datetime
    }
  };

  //Chọn ngày
  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
      setEditedData(prev => ({
        ...prev,
        time: date.toISOString()
      }));
    }
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  //Cập nhật giao dịch
  const handleSaveUpdate = async () => {
    try {
      const db = getFirestore(getApp());
      await updateDoc(doc(db, 'TRANSACTIONS', selectedTransaction.id), {
        customer: editedData.customer,
        serviceName: editedData.serviceName,
        time: editedData.time,
        note: editedData.note
      });
      setModalVisible(false);
      setTimeout(() => { Alert.alert('Thành công', 'Đã cập nhật giao dịch!'); }, 100);
    } catch (error) {
      setTimeout(() => { Alert.alert('Lỗi', 'Không thể cập nhật giao dịch!'); }, 100);
      console.error(error);
    }
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
        <Text style={styles.name}>Khách: {item.customer || 'N/A'}</Text>
        <Text>Dịch vụ: {item.serviceName || 'N/A'}</Text>
        <Text>
          Thời gian:{' '}
          {item.time
            ? `${new Date(item.time).toLocaleDateString('vi-VN')} lúc ${new Date(item.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
            : 'N/A'}
        </Text>

        <Text>Ghi chú: {item.note || 'N/A'}</Text>
        <Text>
          Trạng thái: <Text style={{ color: item.status === 'accepted' ? 'green' : 'orange' }}>
            {item.status || 'pending'}
          </Text>
        </Text>
      </View>
      <View style={styles.actions}>
        {item.status !== 'accepted' && (
          <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.updateBtn} onPress={() => handleUpdate(item)}>
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={require('../images/logolab3.png')} style={styles.logo} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách giao dịch</Text>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có giao dịch nào.</Text>}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật giao dịch</Text>

            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="Tên khách hàng"
              value={editedData.customer}
              editable={false}
            />

            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="Dịch vụ"
              value={editedData.serviceName}
              editable={false}
            />

            <TouchableOpacity style={styles.input} onPress={handleDatePress}>
              <Text style={styles.dateText}>
                {editedData.time ? new Date(editedData.time).toLocaleString() : 'Chọn thời gian'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && Platform.OS === 'ios' && (
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Ghi chú"
              value={editedData.note}
              onChangeText={(text) => setEditedData({ ...editedData, note: text })}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveUpdate}
              >
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Transaction;

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
  actions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 8,
  },
  acceptBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#F25C7A',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  dateText: {
    color: '#000',
    fontSize: 16,
  },
});
