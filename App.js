import { useEffect } from "react";
import { MyContextControlProvider } from "./src/store/Index";
import Router from "./src/routers/Router";
import { getFirestore, collection, doc, onSnapshot, setDoc } from '@react-native-firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { getApp } from '@react-native-firebase/app';

const App = () => {
  const db = getFirestore(getApp());
  const usersCollection = collection(db, 'USERS');
  const admin = {
    fullname: "Admin",
    email: "admin@gmail.com",
    password: "123456",
    phone: "0909090909",
    address: "Hà Nội",
    role: "admin",
  };

  useEffect(() => {
    const userRef = doc(db, 'USERS', admin.email);
    onSnapshot(userRef, userDoc => {
      if (!userDoc.exists) {
        createUserWithEmailAndPassword(getAuth(), admin.email, admin.password)
        .then(response => {
          setDoc(userRef, admin);
          console.log("Tạo tài khoản admin thành công")
        })
      }
    })
  }, [])

  return (
    <MyContextControlProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </MyContextControlProvider>
  );
}

export default App;
