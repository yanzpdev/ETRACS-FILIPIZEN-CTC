import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FormData } from '@/app/interfaces';

interface Form1Props {
  formData: FormData;
  setFormData: any;
  scanID: () => void;
  goToNext: () => void;
  prevRoute: () => boolean;
}

const Form1:React.FC<Form1Props> = ({formData, setFormData, goToNext, prevRoute, scanID}) => {
  const [isFormComplete, setIsFormComplete] = useState(true);

  useEffect(() => {  
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => prevRoute()
    );
    return () => backHandler.remove();
  }, [])

  const checkFormCompleteness = () => {
    const { fullName, contactNum, email, address } = formData;
    if (fullName && contactNum && email && address) {
      setIsFormComplete(true);
    } 
    
    else {
      setIsFormComplete(false);
    }
  };

  useEffect(() => {
    checkFormCompleteness();
  }, [formData]);

  console.log(formData);


  return (
    <ScrollView className='p-10'>
      <Text className='text-2xl font-semibold'>Personal Information</Text>
      <Text className='text-[#AEABAB] top-8 z-10 left-[15px] font-semibold'>Name</Text>
      <TextInput
        className='w-max pb-3 pt-8 px-[16.5px] bg-[#E9EDEE] rounded-xl text-[#636363] text-lg font-semibold'
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />
      <Text className='text-[#AEABAB] top-8 z-10 left-[15px] font-semibold'>Contact Number</Text>
      <TextInput
        className='w-max pb-3 pt-8 px-[16.5px] bg-[#E9EDEE] rounded-xl text-[#636363] text-lg font-semibold'
        value={formData.contactNum}
        keyboardType='numeric'
        maxLength={11}
        onChangeText={(text) => setFormData({ ...formData, contactNum: text })}
      />
      <Text className='text-[#AEABAB] top-8 z-10 left-[15px] font-semibold'>Email</Text>
      <TextInput
        className='w-max pb-3 pt-8 px-[16.5px] bg-[#E9EDEE] rounded-xl text-[#636363] text-lg font-semibold'
        value={formData.email}
        keyboardType="email-address"
        autoCapitalize='none'
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <Text className='text-[#AEABAB] top-8 z-10 left-[15px] font-semibold'>Address</Text>
      <TextInput
        className='w-max pb-3 pt-8 px-[16.5px] bg-[#E9EDEE] rounded-xl text-[#636363] text-lg font-semibold'
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
      />
      <View className='items-center justify-center'>
        <Pressable onPress={scanID} className='mt-8 rounded-xl bg-[#00669D] w-[320px] h-fit py-4 flex-row gap-2 items-center justify-center'>
          <MaterialCommunityIcons name="line-scan" size={24} color="white" />
          <Text className='text-xl text-white font-bold'>Scan</Text>
        </Pressable>
        <Pressable onPress={goToNext} disabled={!isFormComplete} className={`mt-4 rounded-xl ${isFormComplete ? 'bg-[#00669D]' : 'bg-[#3892c3]'} w-[320px] h-fit py-4 flex items-center justify-center`}>
          <Text className='text-xl text-white font-bold'>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default Form1;