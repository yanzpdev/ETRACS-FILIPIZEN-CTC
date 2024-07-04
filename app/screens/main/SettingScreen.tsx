import { View, Text, Alert, FlatList, StyleSheet, Pressable, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getSession, clearSession } from '@/utils/database';
import { router } from 'expo-router';
import Header from '@/components/Header';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      await getSession((user: any) => {
        if (user) {
          setUser(user);
        } 
        
        else {
          router.replace('login');
        }
      });
    };

    const exitApp = () => {
      BackHandler.exitApp()
      clearSession();
    }

    const backAction = () => {
      Alert.alert(
        "Confirm Exit",
        "Are you sure you want to go exit the app?",
        [
          { text: "Yes", onPress: () => exitApp() },
          {
            text: "No",
            onPress: () => null,
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    checkSession();
    return () => backHandler.remove();
  }, []);

    const handleSignOut = async () => {
      try {
        await clearSession();
        router.replace('login'); 
      } 
      
      catch (error) {
        console.error('Error signing out:', error);
        Alert.alert('Sign Out Failed', 'An error occurred while signing out.');
      }
    };

    const confirmSignOut = () => {
    Alert.alert(
      'Confirm Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: handleSignOut,
        },
      ],
      { cancelable: false }
    );
  };

  // console.log('Dashboard - Setting: ', user);

  if (!user) {
    return <Text>Loading...</Text>; 
  }

  const settingItems = [
    {id: 1, action: () => {}, title: 'Setting 1', icon: <MaterialCommunityIcons name="cog-outline" size={32} color="black" />},
    {id: 2, action: () => {}, title: 'Setting 2', icon: <MaterialCommunityIcons name="cog-outline" size={32} color="black" />},
    {id: 3, action: confirmSignOut, title: 'Sign Out', icon: <Ionicons name="log-out-outline" size={32} color="black" />},
  ]
  const renderItem = ({ item }: any) => (
    <Pressable 
      style={styles.buttonWrapper}
      onPress={item.action}
    >
      <View style={styles.item}>
        <View>{item.icon}</View>
        <Text style={styles.text}>{item.title}</Text>
      </View>
    </Pressable>
  );

  return (
    <View className='h-screen bg-white'>
      <Header inForms={false} />
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 120, paddingHorizontal: 50}}>
      <FlatList
          className='w-full mx-auto'
          data={settingItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#e1eaed',
    paddingVertical: 5,
    paddingHorizontal: 40,
    marginVertical: 8,
    marginHorizontal: 'auto',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 55,
    elevation: 5,
    height: 60,
    width: 280
  },

  buttonWrapper: {
    marginHorizontal: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});
