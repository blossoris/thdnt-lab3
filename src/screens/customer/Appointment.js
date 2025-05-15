import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { useMyContextController } from '../../store/Index';

const Appointment = ({ route, navigation }) => {
  const { service } = route.params || {};
  if (!service) {
    return <View style={styles.center}><Text>Không tìm thấy thông tin dịch vụ!</Text></View>;
  }

  const [controller] = useMyContextController();
  const user = controller?.userLogin || {};

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState('');

  const openDateTimePicker = () => {
    if (Platform.OS === 'ios') {
      setShowPicker(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (event?.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setShowTimePicker(true);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event?.type === 'dismissed') {
      setShowTimePicker(false);
      return;
    }
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    const newDate = new Date(date);
    newDate.setHours(currentTime.getHours());
    newDate.setMinutes(currentTime.getMinutes());
    setDate(newDate);
  };

  //Đặt lịch
  const handleBook = async () => {
    if (!date || !user.fullname) {
      setTimeout(() => { Alert.alert('Lỗi', 'Vui lòng chọn ngày giờ và đăng nhập!'); }, 100);
      return;
    }
    try {
      const db = getFirestore(getApp());
      await addDoc(collection(db, 'TRANSACTIONS'), {
        customer: user.fullname,
        customerId: user.id,
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        time: date.toISOString(), // ISO format
        note,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setTimeout(() => {
        Alert.alert('Thành công', 'Đặt lịch thành công!', [
          { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'ServicesList' }] }) }
        ]);
      }, 100);
    } catch (error) {
      setTimeout(() => { Alert.alert('Lỗi', 'Không thể đặt lịch!'); }, 100);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lịch dịch vụ</Text>
      <Text style={styles.label}>Dịch vụ: <Text style={{ fontWeight: 'normal' }}>{service.name}</Text></Text>
      <Text style={styles.label}>Khách hàng: <Text style={{ fontWeight: 'normal' }}>{user.fullname}</Text></Text>
      <Text style={styles.label}>Chọn ngày giờ *</Text>
      <TouchableOpacity style={styles.input} onPress={openDateTimePicker}>
        <Text>{date.toLocaleString('vi-VN')}</Text>
      </TouchableOpacity>

      {/* iOS datetime picker */}
      {showPicker && Platform.OS === 'ios' && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setDate(selectedDate);
            setShowPicker(false);
          }}
        />
      )}

      {/* Android: Date then Time */}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Text style={styles.label}>Ghi chú</Text>
      <TextInput
        style={styles.input}
        placeholder="Ghi chú (nếu có)"
        value={note}
        onChangeText={setNote}
      />
      <TouchableOpacity style={styles.button} onPress={handleBook}>
        <Text style={styles.buttonText}>Đặt lịch</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Appointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F25C7A',
    marginBottom: 20,
    textAlign: 'center',
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
//2124802010728 - Võ Ngân Khanh
