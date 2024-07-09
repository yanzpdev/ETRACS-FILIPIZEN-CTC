import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FormData } from '@/app/interfaces';
import { checkViolatorExists, setupDatabase } from '@/utils/database';

interface Form1Props {
  formData: FormData;
  setFormData: any;
  scanID: () => void;
  goToNext: () => void;
  prevRoute: () => boolean;
}

const Form1:React.FC<Form1Props> = ({formData, setFormData, goToNext, prevRoute, scanID}) => {
  const [isFormComplete, setIsFormComplete] = useState(true);
  const [violatorFname, setViolatorFname] = useState("");
  const [violatorList, setViolatorList] = useState<any>([]);
  const [listActive, setListActive] = useState<boolean>(false);

  useEffect(() => {  
    setupDatabase();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => prevRoute()
    );
    return () => backHandler.remove();
  }, [])

  const checkFormCompleteness = () => {
    const { firstName, lastName, contactNum, email, address } = formData;
    if (firstName && lastName && contactNum && email && address) {
      setIsFormComplete(true);
    } 
    
    else {
      setIsFormComplete(false);
    }
  };

  const setName = (fName: string, mName: string, lName: string, num: string, email: string, address: string ) => {
    setFormData({ ...formData, firstName: fName, middleName: mName, lastName: lName, contactNum: num, email: email, address: address });
  }
  
  useEffect(() => {
    const violatorCheck = async() => {
      try {
        const res = await checkViolatorExists(formData.firstName);
        setViolatorList(res);

        if (formData.firstName === "") {
          setViolatorList([]);
        }
      }

      catch(error: any) {
        console.log("Error: ", error);
      }
    };
    violatorCheck();
  }, [formData])


  useEffect(() => {
    checkFormCompleteness();
  }, [formData]);

  console.log(violatorList);

  return (
    <ScrollView>
      <View className='p-10 pb-20'>
        <Text className='text-2xl font-semibold'>Personal Information</Text>
        <Text className='text-[#AEABAB] top-8 z-20 left-[15px] font-semibold'>First Name</Text>
        <TextInput
          className='w-max pb-3 pt-8 px-[16.5px] z-10 bg-[#E9EDEE] rounded-xl text-[#636363] text-lg font-semibold'
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        />
        {violatorList.length != 0 &&
          <ScrollView className='bg-red-300 rounded-xl pb-3 h-32 -mt-5 pt-8 px-[16.5px]'>
            <View>
              {violatorList.map((violator: any, index: number) => (
              <Pressable key={index} onPress={() => setName(violator.firstName, violator.middleName, violator.lastName, violator.contactNum, violator.email, violator.address)}>
                <Text className='text-white my-2'>{index+1}. {violator.firstName}{violator.middleName !== "" && " "+ violator.middleName} {violator.lastName}</Text>
              </Pressable>
              ))}
            </View>
          </ScrollView>
        }
        <Text className='text-[#AEABAB] top-8 z-10 left-[15px] font-semibold'>Middle Name</Text>
        <TextInput
          className='w-max pb-3 pt-8 px-[16.5px] bg-[#E9EDEE] rounded-xl text-[#636363] text-lg font-semibold'
          value={formData.middleName}
          onChangeText={(text) => setFormData({ ...formData, middleName: text })}
        />
        <Text className='text-[#AEABAB] top-8 z-10 left-[15px] font-semibold'>Last Name</Text>
        <TextInput
          className='w-max pb-3 pt-8 px-[16.5px] bg-[#E9EDEE] rounded-xl text-[#636363] text-lg font-semibold'
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
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
      </View>
    </ScrollView>
  )
}

export default Form1;