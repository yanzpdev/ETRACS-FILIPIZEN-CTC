import { StyleSheet, Text, View, Image, TextInput, Pressable, Alert, Keyboard } from 'react-native';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import '@/global.css';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

const etracsIP = '192.168.2.11';
const etracsPort = '8070';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 

  function generateHmacMD5(seed: string, v: string) {
    const hmac = CryptoJS.HmacMD5(v, seed);
    return hmac.toString();
  }
  
  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!username && !password) {  
      Alert.alert('Login failed', 'Please provide username and password');
      setUsername('');
      setPassword('');
      return;
    }

    else if (!username && password) {
      Alert.alert('Login failed', 'Username cannot be blank.');
      setUsername('');
      setPassword('');
      return;
    }

    else if (username && !password) {
      Alert.alert('Login failed', 'Password cannot be blank.');
      setUsername('');
      setPassword('');
      return;
    }

    setLoading(true);
    const lowercasedUsername = username.toLowerCase().toString()
    const hash = await generateHmacMD5(lowercasedUsername, password);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);
  
    try {
      const res = await fetch(`http://${etracsIP}:${etracsPort}/osiris3/json/etracs25/LoginService.login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          env: {
            CLIENTTYPE: 'mobile',
          },
          args: {
            username: username,
            password: hash,
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
  
      if (!res.ok) {
        Alert.alert('Login failed', 'Please check your internet connection and try again.');
        setUsername('');
        setPassword('');
        return;
      }
  
      const data = await res.json();
  
      if (data.status === 'ERROR') {
        Alert.alert('Login failed', 'Wrong username and/or password.');
        setUsername('');
        setPassword('');
        return;
      } 
      
      delete data.env.ROLES;
      await AsyncStorage.setItem('readerInfo', JSON.stringify(data));
      // console.log("Successfully saved user info to AsyncStorage");  
      const info = await AsyncStorage.getItem('readerInfo');
      console.log(info);
      router.replace('dashboard');
    } 
    
    catch (error) {
      Alert.alert('Login failed', 'A problem ocurred, please try again.');
      setUsername('');
      setPassword('');
    } 
    
    finally {
      setLoading(false);
    }
  };
  
  useKeepAwake();
  return (
    <View className='h-screen w-screen flex flex-1 items-center justify-center'> 
      <View className='h-fit w-fit bg-transparent relative' style={styles.padding}>
        <View className='flex items-center justify-center my-10'>
          <Image source={require('@/assets/images/etracslogo.png')} style={{width: 300, height: 70}}/>
        </View>
        <Text className='text-[#AEABAB] top-9 z-10 left-[24px] text-lg font-semibold'>Email</Text>
        <TextInput
          className='w-max pb-3 pt-8 px-7 bg-[#E9EDEE] rounded-full text-[#636363] text-lg font-semibold'
          keyboardType="email-address"
          autoCapitalize='none'
          onChangeText={setUsername}
          value={username}
        />
        <View className='text-[#AEABAB] px-7 top-9 z-10 w-full flex flex-row justify-between items-center'>
          <Text className='text-[#AEABAB] text-lg font-semibold'>Password</Text>
          <MaterialCommunityIcons 
            name={showPassword ? 'eye-off' : 'eye'} 
            size={24} 
            color="#AEABAB"
            className=' top-4'
            onPress={toggleShowPassword} 
          /> 
        </View>
        <TextInput
          secureTextEntry={!showPassword}
          className='w-max pb-3 pt-8 px-7 bg-[#E9EDEE] rounded-full text-[#636363] text-lg font-semibold'
          keyboardType="default"
          onChangeText={setPassword}
          autoCapitalize='none'
          value={password}
        />
        <View className='mt-6 overflow-hidden rounded-full' style={{overflow: 'hidden'}}>
          <Pressable
            className={`${loading ? 'bg-[#3892c3]' : 'bg-[#00669D]'} duration-300 py-5 rounded-full flex items-center justify-center`}
            android_ripple={{color: '#007DC1', borderless: true}}
            onPress={handleLogin}
          >
            {loading === true ?
              <Image source={require('@/assets/images/loginloading.gif')} style={{width: 24, height: 24}}/>
            :
              <Text className='text-white text-lg font-semibold'>Sign In</Text>
            }
          </Pressable>
        </View>
        <View style={{flexDirection: 'row', marginTop: 30, justifyContent: 'center', gap: 10}}>
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
          />
          <Text>Remember me on this device</Text>
        </View>
      </View>
    </View>
  )
}

export default LoginScreen;
const styles = StyleSheet.create({
  text: {
    color: '#fff',
    backgroundColor: 'blue',
  },
  padding: {
    padding: 20
  }
})
