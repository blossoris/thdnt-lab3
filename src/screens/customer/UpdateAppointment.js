import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, doc, updateDoc } from '@react-native-firebase/firestore';

const UpdateAppointment = ({ route, navigation }) => {
  const { appointment } = route.params || {};
  if (!appointment) {
    return <View style={styles.center}><Text>Không tìm thấy lịch hẹn!</Text></View>;
  }
  //2124802010728 - Võ Ngân Khanh
  const [date, setDate] = useState(
    appointment.time ? new Date(appointment.time) : new Date() // Chuyển chuỗi ISO string thành Date
  );
  const [showPicker, setShowPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState(appointment.note || '');

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

  const handleUpdate = async () => {
    if (!date) {
      setTimeout(() => { Alert.alert('Lỗi', 'Vui lòng chọn ngày giờ!'); }, 100);
      return;
    }
  
    try {
      const db = getFirestore(); // Lấy instance Firestore
      const docRef = doc(collection(db, 'TRANSACTIONS'), appointment.id); // Tạo doc ref mới
  
      // Lưu thời gian theo định dạng ISO string
      await updateDoc(docRef, {
        time: date.toISOString(), // Lưu thời gian dưới dạng ISO string
        note,
      });
  
      setTimeout(() => {
        Alert.alert('Thành công', 'Đã cập nhật lịch hẹn!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }, 100);
    } catch (error) {
      setTimeout(() => { Alert.alert('Lỗi', 'Không thể cập nhật lịch hẹn!'); }, 100);
      console.error(error);
    }
  };
  
  

  const openDateTimePicker = () => {
    if (Platform.OS === 'ios') {
      setShowPicker(true);
    } else {
      setShowDatePicker(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cập nhật lịch hẹn</Text>
      <Text style={styles.label}>
        Dịch vụ: <Text style={{ fontWeight: 'normal' }}>{appointment.serviceName}</Text>
      </Text>
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

      {/* Android date + time pickers */}
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
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateAppointment;

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
    backgroundColor: '#4CAF50',
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
