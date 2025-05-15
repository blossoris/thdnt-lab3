import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';


//2124802010728 - Võ Ngân Khanh
function parseVNDateString(str) {
  if (!str) return new Date();
  str = str.replace(',', '');
  const [datePart, timePart] = str.trim().split(' ');
  if (!datePart || !timePart) return new Date();
  const [day, month, year] = datePart.split('/').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

const ServiceDetail = ({ route, navigation }) => {
  const { service } = route.params || {};
  if (!service) {
    return <View style={styles.center}><Text>Không tìm thấy thông tin dịch vụ!</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{service.name}</Text>
      <Text style={styles.label}>Price: <Text style={styles.value}>{service.price?.toLocaleString('vi-VN')} ₫</Text></Text>
      <Text style={{ marginTop: 10 }}>
        <Text style={styles.label}>Creator: </Text>
        <Text>{service.creator}</Text>
      </Text>
      <Text style={{ marginTop: 10 }}>
        <Text style={styles.label}>Time: </Text>
        <Text>{service.time}</Text>
      </Text>
      <Text style={{ marginTop: 10 }}>
        <Text style={styles.label}>Final update: </Text>
        <Text>{service.finalUpdate}</Text>
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Appointment', { service })}>
        <Text style={styles.buttonText}>Đặt lịch</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ServiceDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F25C7A',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 10,
  },
  value: {
    fontWeight: 'normal',
    color: '#222',
  },
  button: {
    backgroundColor: '#F25C7A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30,
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