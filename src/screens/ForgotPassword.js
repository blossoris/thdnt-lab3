import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth'
import { getApp } from '@react-native-firebase/app'

// 2124802010728 - Võ Ngân Khanh
const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email của bạn')
      return
    }

    try {
      setLoading(true)
      const auth = getAuth(getApp())
      await sendPasswordResetEmail(auth, email)
      Alert.alert(
        'Thành công',
        'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      )
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại'
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email không hợp lệ'
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Không tìm thấy tài khoản với email này'
      }
      Alert.alert('Lỗi', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../images/logolab3.png')} style={styles.logo} />
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập email của bạn để nhận link đặt lại mật khẩu
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F25C7A',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#F25C7A',
    fontSize: 16,
  },
})