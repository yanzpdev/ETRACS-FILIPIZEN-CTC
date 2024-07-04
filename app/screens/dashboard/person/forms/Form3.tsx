import { View, Text, StyleSheet, Pressable, ScrollView, Image, BackHandler } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { FormData } from '@/app/interfaces';
import Signature from 'react-native-signature-canvas';
import { EvilIcons } from '@expo/vector-icons';

type Form3Props = {
  formData: FormData;
  setFormData: any;
  goToNext: () => void;
  goToPrevious: () => void;
  handleSubmit: () => void;
}

const Form3:React.FC<Form3Props> = ({formData, setFormData, goToPrevious, goToNext}) => {
  const signatureRef = useRef<any>(null);

  const webStyle = `.m-signature-pad--footer .save { display: none; } .clear { display: none; }`;

  const handleClear = () => {
    signatureRef.current.clearSignature();
    setFormData({ ...formData, signature: "" });
  };

  const handleEndDrawing = () => {
    signatureRef.current?.readSignature();
  };

  useEffect(() => {
    const backAction = () => {
      goToPrevious();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const handleOK = (signature: any) => {
    // const base64code = signature.replace('data:image/png;base64,', 'data:image/png;base64,');
    setFormData({ ...formData, signature: signature });
  };

  return (
    <ScrollView className='h-screen p-10'>
      <View className='flex-row justify-between items-center'>
        <Text className='text-2xl font-semibold'>Signature</Text>
        <Pressable 
          className='flex-row items-center justify-center rounded-xl py-2 pl-2 pr-4 bg-slate-200'
          onPress={handleClear}
        >
          <EvilIcons className='-mt-2' name="undo" size={35} color="black" />
          <Text className='text-lg font-semibold'>Clear</Text>
        </Pressable>
      </View>
      <View className='top-4 h-[400px]'>
        <Signature
          ref={signatureRef}
          webStyle={webStyle}
          onOK={handleOK}
          onEnd={handleEndDrawing}
          backgroundColor='#fff'
        />
      </View>
      <View>
      </View>
      <View className='items-center -top-10 justify-center'>
        <Pressable 
          onPress={goToNext} 
          disabled={formData.signature === ""}
          className={`mt-4 rounded-xl ${formData.signature !== "" ? 'bg-[#00669D]' : 'bg-[#6aadd0]'} w-[320px] h-fit py-4 flex items-center justify-center`}
        >
          <Text className='text-xl text-white font-bold'>Next</Text>
        </Pressable>
        <Pressable 
          onPress={goToPrevious} 
          className='mt-4 rounded-xl bg-white border w-[320px] h-fit py-4 flex items-center justify-center'
        >
          <Text className='text-xl font-bold'>Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default Form3;
