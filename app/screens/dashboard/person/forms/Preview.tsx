import { View, Text, Pressable, ScrollView, Image, BackHandler } from 'react-native'
import { FormData } from '@/app/interfaces';
import { useEffect, useState } from 'react';
import { checkViolatorExists, countOffense, getSession } from '@/utils/database';

type PreviewProps = {
  formData: FormData;
  setFormData: any;
  handleSubmit: () => void;
  goToPrevious: () => void;
}

const Preview:React.FC<PreviewProps> = ({formData, handleSubmit, goToPrevious, setFormData}) => {
  const [user, setUser] = useState<any>();

  const printBtn = async () => {
    handleSubmit();
    // setFormData({ ...formData, printed: true });
    // const exists = await checkViolatorExists(formData.fullName);
    // await getSession((user: any) => {
    //   if (user) {
    //     setUser(user);    
    //   }
      
    //   else {
    //     console.error("no user data");
    //   }
    // });

    // if (exists) {
    //   countOffense(user.id);
    // }
  }
  useEffect(() => {
    const backAction = () => {
      goToPrevious();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <ScrollView>
      <View className='p-10'>  
        <View className='flex-row justify-between items-center' style={{zIndex: 40}}>
          <Text className='text-2xl font-semibold'>Preview</Text>
        </View>
        <View 
          className='bg-white p-5 px-7 gap-y-5 mt-9 rounded-xl'
          style={{elevation: 5}}
        >
          <View className='flex-row items-center justify-between'>
            <Text className='font-semibold'>Name:</Text>
            <Text className='font-semibold'>{formData.fullName}</Text>
          </View>
          <View className='flex-row items-center justify-between'>
            <Text className='font-semibold'>Contact Number:</Text>
            <Text className='font-semibold'>{formData.contactNum}</Text>
          </View>
          <View className='flex-row items-center justify-between'>
            <Text className='font-semibold'>Email:</Text>
            <Text className='font-semibold'>{formData.email}</Text>
          </View>
          <View className='flex-row items-center justify-between'>
            <Text className='font-semibold'>Address:</Text>
            <Text className='font-semibold'>{formData.address}</Text>
          </View>
          <View className='flex-row items-center justify-between'>
            <Text className='font-semibold'>Violation/s:</Text>
            <Text className='font-semibold'>{formData.violations.length}</Text>
          </View>
          <View className='flex-row items-center ml-5 justify-between'>
            <Text className='font-semibold'>Ordinance 1361:</Text>
            <Text className='font-semibold'>Anti-littering Ordinance</Text>
          </View>
          {formData.violations.map((violation) => (
            <View key={violation.violationId} className='flex-row items-end ml-10 justify-between'>
              <Text className='font-semibold w-56 text-justify'>Title {violation.title} Art {violation.article} - {violation.desc}</Text>
              <Text className='font-semibold'>1st Offense</Text>
            </View>
          ))}
          <View className='flex-row items-center ml-5 justify-between'>
            <Text className='font-semibold'>Amount to Pay:</Text>
            <Text className='font-semibold'>₱ 1500</Text>
          </View>
          <View className='flex-col items-center justify-center'>
            <Text className='font-semibold'>Signed</Text>
            <Image
              source={{ uri: formData.signature}}
              style={{height: 100, width: 150}}
            />
          </View>
        </View>
        <View className='items-center top-0 justify-center'>
          <Pressable 
            onPress={printBtn}
            // disabled={formData.printed}
            className={`mt-4 rounded-xl ${!formData.printed ? 'bg-[#00669D]' : 'bg-[#6aadd0]'} w-96 h-fit py-4 flex items-center justify-center`}
          >
            <Text className='text-xl text-white font-bold'>Print</Text>
          </Pressable>
          <Pressable 
            onPress={goToPrevious} 
            className='mt-4 rounded-xl bg-white border w-96 h-fit py-4 flex items-center justify-center'
          >
            <Text className='text-xl font-bold'>Back</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}

export default Preview;

