import { View, Text, Alert, FlatList, StyleSheet, Pressable, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getSession, clearSession } from '@/utils/database';
import { Link, router } from 'expo-router';
import Header from '@/components/Header';
import { Entypo, FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem('readerInfo');
        if (session) {
          setUser(user);
        } 
        
        else {
          router.replace('login');
        }
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
          {
            text: "No",
            onPress: () => null,
            style: "cancel"
          },
          { text: "Yes", onPress: () => exitApp() }
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


  // if (!user) {
  //   return <Text>Loading...</Text>; 
  // }

  const menuItems = [
    {id: 1, link: 'dashboard/person', title: 'Person', icon: <FontAwesome5 name="user" size={40} color="black" />},
    {id: 2, link: 'dashboard/traffic', title: 'Traffic', icon: <AntDesign name="car" size={40} color="black" />},
    {id: 3, link: 'dashboard/business', title: 'Business', icon: <Ionicons name="briefcase-outline" size={40} color="black" />},
    {id: 4, link: 'dashboard/special', title: 'Special', icon: <Entypo name="dots-three-horizontal" size={40} color="black" />},
    {id: 5, link: 'dashboard/upload', title: 'Upload to Server', icon: <AntDesign name="clouduploado" size={40} color="black" />},
    {id: 6, link: 'dashboard/viewtickets', title: 'View Tickets Issued', icon: <AntDesign name="folderopen" size={40} color="black" />},
  ]
  const renderItem = ({ item }: any) => (
    <Link 
      style={styles.linkWrapper}
      href={item.link}
    >
      <View style={styles.item}>
        <Text style={styles.text}>{item.title}</Text>
        <View>{item.icon}</View>
      </View>
    </Link>
  );

  return (
    <View className='h-screen bg-white'>
      <Header inForms={false} />
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: -120, paddingHorizontal: 40}}>
        <Text className='font-bold text-3xl text-start w-full'>Issue Ticket</Text>
        <View className='w-full'>
          <FlatList
            className='w-full mx-auto'
            data={menuItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 1,
    paddingHorizontal: 1,
    marginVertical: 8,
    marginHorizontal: 'auto',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    height: 100,
    width: 130
  },

  linkWrapper: {
    paddingHorizontal: 5,
    marginVertical: 8,
    marginHorizontal: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
});
