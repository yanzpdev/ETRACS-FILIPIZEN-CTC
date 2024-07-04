import { StyleSheet, Text, View, Image, TextInput, Pressable, Alert, Keyboard } from 'react-native';
import Checkbox from 'expo-checkbox';
import React, { useCallback, useEffect, useState } from 'react';
import '@/global.css';
import * as SplashScreen from 'expo-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useKeepAwake } from 'expo-keep-awake';
import { getSession, setupDatabase, validateLogin } from '@/utils/database.js';
import { router } from 'expo-router';

type CallbackTypes = boolean | 'wrongPassword' | 'doesNotExist' | 'emptyPassword';

const Stack = createStackNavigator();

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [user, setUser] = useState<any>();

  // this causes Error: Rendered more hooks than during the previous render.
  useEffect(() => {
    setupDatabase();

    // const checkSession = async () => {
    //   await getSession((user: any) => {
    //     if (user) {
    //       setUser(user);    
    //       console.log(user);
    //     }
        
    //     else {
    //       console.error("no user data");
    //     }
    //   });
    // };

    // checkSession();
  }, []);

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 

  // const [fontsLoaded, fontError] = useFonts({
  //   'Ubuntu': require('@/assets/fonts/Ubuntu-Regular.ttf'),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, fontError]);

  // if (!fontsLoaded && !fontError) {
  //   return null;
  // }

  const handleSignIn = async () => {
    validateLogin(email, password, (callback: CallbackTypes) => {
      Keyboard.dismiss();
      console.log(callback);
      if (callback === true) {
        // Alert.alert('Login success', 'You are now logged in.');
        setLoading(true);
        // Verify the session
        getSession((user: any) => {
          if (user) {
            setTimeout(() => {
              router.replace('dashboard');
            }, 2000);
          } 
          
          else {
            setLoading(false);
            Alert.alert('Login failed', 'Unable to create session.');
          }
        });
      } 
  
      else if(callback === 'wrongPassword') {
        setLoading(true);
        setTimeout(() => {
          Alert.alert(
            'Login failed', 
            'Invalid password.',
          );
          setLoading(false);
        }, 2000)
      }
  
      else if(callback === 'doesNotExist') {
        setLoading(true);
        setTimeout(() => {
          Alert.alert(
            'Login failed', 
            'Account does not exist.',
          );
          setLoading(false);
        }, 2000)
      }
      
      else if(callback === 'emptyPassword') {
        setLoading(true);
        setTimeout(() => {
          Alert.alert(
            'Login failed', 
            'Please provide your password.',
          );
          setLoading(false);
        }, 2000)
      }
  
      else {
        setTimeout(() => {
          setLoading(true);
          Alert.alert(
            'Login failed', 
            'An error occurred while signing in.',
          );
          setLoading(false);
        }, 2000)
      }
    });
  };
  

  useKeepAwake();
  // {/*  onLayout={onLayoutRootView} */} put this on Top most parent View container {/*  onLayout={onLayoutRootView} */}
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
          onChangeText={setEmail}
          value={email}
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
            onPress={handleSignIn}
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
