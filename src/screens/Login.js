import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useMyContextController, login, logout } from '../store/Index';
import { HelperText } from 'react-native-paper';
import Home from './customer/Home'  

const Login = ({navigation}) => {
  const [controller, dispatch] = useMyContextController()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { userLogin } = controller
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
//2124802010728 - Võ Ngân Khanh
  const hasErrorEmail = () => {
    return !email.includes('@')
  }

  const hasErrorPassword = () => {
    return password.length < 6
  }

  const handleLogin = async () => {
    if (hasErrorEmail() || hasErrorPassword()) {
      setTimeout(() => { Alert.alert('Error', 'Vui lòng kiểm tra lại email và mật khẩu') }, 100);
      return
    }
    setIsLoading(true)
    try {
      await login(dispatch, email, password)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout(dispatch);
      navigation.navigate('Login');
    } catch (error) {
      setTimeout(() => { Alert.alert('Error', 'Failed to logout'); }, 100);
    }
  }

  useEffect(() => {
    if (userLogin) {
      if(userLogin.role === 'admin') {
        navigation.replace('Admin')
      } else if (userLogin.role === 'customer') {
        navigation.replace('Home')
      }
    }
  }, [userLogin])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput placeholder='Email' 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail}
        label="Email"
      /> 
      <HelperText type="error" visible={hasErrorEmail()}>Địa chỉ email không hợp lệ</HelperText>
      
      <View style={styles.passwordContainer}>
        <TextInput 
          placeholder='Password' 
          style={[styles.input, styles.passwordInput]}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <HelperText type="error" visible={hasErrorPassword()}>Mật khẩu phải có ít nhất 6 ký tự</HelperText>
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon 
            name={showPassword ? 'eye-slash' : 'eye'} 
            size={20} 
            color="grey"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Bạn chưa có tài khoản?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerButton}>
            <Text style={styles.registerText}>Tạo tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'pink',
        marginBottom: 20,
    },
    input: {
        width: 250,
        height: 50,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        marginTop: 20,
        padding: 10,
        color: 'black',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 40,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 35,
    },
    button: {
        width: 250,
        height: 40,
        backgroundColor: 'pink',
        borderRadius: 5,
        marginTop: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 10,
    },
    registerContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    registerText: {
        marginBottom: 10,
    },
    registerButton: {
        marginTop: 5,
    },
    forgotPasswordButton: {
        marginTop: 10,
    }
})