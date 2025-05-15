import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createContext, useContext, useMemo, useReducer, useEffect} from 'react'
import { Alert } from 'react-native'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@react-native-firebase/auth'
import { getFirestore, collection, doc, onSnapshot, getDoc } from '@react-native-firebase/firestore'
import { getApp } from '@react-native-firebase/app'

//2124802010728 - Võ Ngân Khanh

const MyContext = createContext()
MyContext.displayName = 'vbdvabv'

const reducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {...state, userLogin: action.value}
    case 'LOGOUT':
      return {...state, userLogin: null}
    case 'SET_USER_LOGIN':
      return {...state, userLogin: action.payload}
    default:
      return state
  }
}

//Định nghĩa context
const MyContextControlProvider = ({children}) => {
  //Khởi tạo state
  const [controller, dispatch] = useReducer(reducer, {
    userLogin: null,
    services: [],
  })

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, 'USERS', user.email);
        getDoc(userRef).then((userSnap) => {
          if (userSnap.exists()) {
            dispatch({ type: 'SET_USER_LOGIN', payload: { id: userSnap.id, ...userSnap.data() } });
          }
        }).catch((error) => {
          console.error("Error fetching user data:", error);
        });
      } else {
        dispatch({type: 'LOGOUT'});
      }
    });

    return () => unsubscribe();
  }, []);
  
  // Wrap the value in an array to ensure it's iterable
  const value = useMemo(() => [controller, dispatch], [controller])

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  )
}
//Định nghĩa useMyContextController
const useMyContextController = () => {
  const context = useContext(MyContext)
  if (!context) {
    throw new Error('useMyContextController must be used inside MyContextControlProvider')
  }
  return context
}
//Định nghĩa USERS
const db = getFirestore(getApp())
const usersCollection = collection(db, 'USERS')

const login = async (dispatch, email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(getAuth(), email, password)
        const userRef = doc(db, 'USERS', email)
        
        getDoc(userRef).then((userSnap) => {
            if (userSnap.exists()) {
                dispatch({ type: 'SET_USER_LOGIN', payload: { id: userSnap.id, ...userSnap.data() } })
            } else {
                console.log("No user data found for:", email)
                setTimeout(() => { Alert.alert('Error', 'Không tìm thấy thông tin người dùng') }, 100);
            }
        }).catch((error) => {
            console.error("Error fetching user data:", error)
            setTimeout(() => { Alert.alert('Error', 'Không thể lấy thông tin người dùng') }, 100);
        })
    } catch (error) {
        console.error("Login error:", error)
        setTimeout(() => {
            Alert.alert(
                'Login Error',
                'Sai email và sai password: ' + error.message,
                [{ text: 'OK' }]
            )
        }, 100);
    }
}

const logout = async (dispatch) => {
    try {
        await signOut(getAuth())
        dispatch({type: 'LOGOUT'})
    } catch (error) {
        console.error("Logout error:", error)
        setTimeout(() => { Alert.alert('Error', 'Failed to logout') }, 100);
    }
}

export {MyContextControlProvider, useMyContextController, login, logout}