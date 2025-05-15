    import { StyleSheet, Text, View } from 'react-native'
    import React from 'react'
    import { useState } from 'react';
    import { TextInput, HelperText, Button } from 'react-native-paper';
    import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
    import { getFirestore, collection, doc, setDoc } from '@react-native-firebase/firestore';
    import { getApp } from '@react-native-firebase/app';
    import { Alert } from 'react-native';

    const Register = ({navigation}) => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(true);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const hasErrorFullname = () => fullname == "";
    const hasErrorEmail = () => !email.includes("@");
    const hasErrorPassword = () => password.length < 6;
    const hasErrorConfirmPassword = () => password != confirmPassword;
    const hasErrorPhone = () => phone.length != 10;
    const hasErrorAddress = () => address.length < 3;
    //2124802010728 - Võ Ngân Khanh
    const db = getFirestore(getApp());
    const usersCollection = collection(db, "USERS");

    const handleCreateAccount = () => {
        createUserWithEmailAndPassword(getAuth(), email, password)
        .then(response => {
            const userRef = doc(db, "USERS", email);
            setDoc(userRef, {
                fullname,
                email,
                password,
                phone,
                address,
                role: "customer",
            });
         setTimeout(() => { Alert.alert('Thành công', 'Đăng ký thành công! Tiến hành đăng nhập!') }, 100)
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        })
        .catch((error) => {
            setTimeout(() => { Alert.alert("Error", error.message); }, 100);
        })
    }


    return (
        <View style={{flex:1, padding: 10, paddingTop: 30}}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullname}
                onChangeText={setFullname}
            />
            <HelperText type="error" visible={hasErrorFullname()}>
                Full Name không được phép để trống
            </HelperText>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <HelperText type="error" visible={hasErrorEmail()}>
                Email không được phép để trống
            </HelperText>
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hiddenPassword}
            />
            <HelperText type="error" visible={hasErrorPassword()}>
                Password ít nhất 6 ký tự
            </HelperText>
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={hiddenConfirmPassword}
            />
            <HelperText type="error" visible={hasErrorConfirmPassword()}>
                Confirm Password phải giống với Password
            </HelperText>
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
            />
            <HelperText type="error" visible={hasErrorPhone()}>
                Phone phải có 10 số
            </HelperText>
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
            />
            <HelperText type="error" visible={hasErrorAddress()}>
                Address ít nhất 3 ký tự
            </HelperText>
            <Button mode="contained" onPress={handleCreateAccount} style={{backgroundColor: "#F25C7A"}}>
                Tạo tài khoản
            </Button>
            <View style={{flexDirection: "row", justifyContent: "center", marginTop: 10, alignItems: "center"}}>
                <Text>Đã có tài khoản? </Text>
                <Button mode="contained" onPress={() => navigation.navigate("Login")} style={{backgroundColor: "#F25C7A"}}>
                Đăng nhập
                </Button>
            </View>
        </View>
    )
    }

    export default Register

    const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        alignSelf: "center",
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        backgroundColor: "#F25C7A",
    },
    text: {
        marginBottom: 10,
    },
    view: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        alignItems: "center",
    },
})