import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, Image, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
import Svg, { Rect } from 'react-native-svg';
import { useSharedValue } from 'react-native-worklets-core';
import { Worklets } from 'react-native-worklets-core';
import { crop, CropRegion } from 'vision-camera-cropper';
import { FormData } from '@/app/interfaces';
import MlKitOcr from 'react-native-mlkit-ocr';
import * as FileSystem from 'expo-file-system';
import { parse } from 'mrz'

interface CameraScreenProps {
  scanID: () => void;
  setFormData: any;
  formData: FormData;
}

const CameraScreen:React.FC<CameraScreenProps> = ({scanID, setFormData, formData}) => {
  const cardKey = useRef("");
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [pressed, setPressed] = useState(false);
  const cropRegionShared = useSharedValue<undefined|CropRegion>(undefined);
  const shouldTake = useSharedValue(false);
  const device = useCameraDevice("back");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);  
  const [imageUri, setImageUri] = useState<string>();
  
  const format = useCameraFormat(device, [
    { videoResolution: { height: 1920, width: 1080 } },
    { fps: 30 }
  ]);

  const [cropRegion, setCropRegion] = useState({
    left: 12,
    top: 48,
    width: 80,
    height: 40,
  });  

  const getViewBox = () => {
    const frameSize = getFrameSize();
    return `0 0 ${frameSize.width} ${frameSize.height}`;
  };  

  const capture = () => {
    shouldTake.value = true;
  };  

  const onCaptured = async (base64: string) => {
    setIsActive(false);
    setCapturedImage(base64);
    recognizeText(base64);
  };  

  const extractIDNumber = (result: any) => {
    // const regex = /\b\d{4}-\d{4}-\d{4}-\d{4}\b/; 
    const regex = /\b[A-Za-z0-9]{1,4}-\d{1,4}-\d{1,8}\b/;
    const lines = result.split('\n');

    for (const line of lines) {
      const match = line.match(regex);
      if (match) {
        return match[0];
      }
    }
  };

  const recognizeText = async (base64: string) => {
    try {
      const directory = `${FileSystem.documentDirectory}images/`;
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      
      const filename = `${directory}image-${Date.now()}.png`;
      
      await FileSystem.writeAsStringAsync(filename, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setImageUri(filename);

      console.log('Image saved successfully:', filename);
      const result = await MlKitOcr.detectFromFile(filename);
      const text = result.map((block) => block.text).join('\n'); 
      console.log(text);
      const idNumber = extractIDNumber(text);
      console.log(idNumber);
    } 
    
    catch (error) {
      console.error('Error saving file: ', error);
    }
  };

  const onCapturedJS = Worklets.createRunOnJS(onCaptured);  

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (shouldTake.value && cropRegionShared.value) {
      shouldTake.value = false;
      const result = crop(frame, { cropRegion, includeImageBase64: true, saveAsFile: false });
      if (result.base64) {
        onCapturedJS(result.base64);
      }
    }
  }, []);  

  const adaptCropRegionForIDCard = () => {
    let size = getFrameSize();
    let regionWidth = 0.8 * size.width;
    let desiredRegionHeight = regionWidth / (85.6 / 54);
    let height = Math.ceil((desiredRegionHeight / size.height) * 100);
    let region = {
      left: 10,
      width: 80,
      top: 20,
      height: height,
    };
    setCropRegion(region);
    cropRegionShared.value = region;
  };  

  const getFrameSize = (): { width: number; height: number } => {
    let size = { width: 980, height: 1920 };
    return size;
  };  

  useEffect(() => {
    (async () => {
      adaptCropRegionForIDCard();
    })();
  }, []);  

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
      setIsActive(true);
    })();
  }, []);

  const btnPressed = () => {
    scanID();
    setFormData({ ...formData, fullName: "Arris Ian Peralta" });
  } 

  return (
    <>
      {capturedImage == null ?
        <View style={StyleSheet.absoluteFill}>
          {device != null &&
          hasPermission && (
            <>
              <Camera
                style={StyleSheet.absoluteFill}
                isActive={isActive}
                device={device}
                format={format}
                frameProcessor={frameProcessor}
                pixelFormat='yuv'
              />
               <Svg preserveAspectRatio={(Platform.OS == 'ios') ? '':'xMidYMid slice'} style={StyleSheet.absoluteFill} viewBox={getViewBox()}>
                <Rect 
                  x={cropRegion.left/100*getFrameSize().width}
                  y={cropRegion.top/100*getFrameSize().height}
                  width={cropRegion.width/100*getFrameSize().width}
                  height={cropRegion.height/100*getFrameSize().height}
                  strokeWidth="2"
                  stroke="red"
                  fillOpacity={0.0}
                />
              </Svg>
            </>
          )}
          <View style={[styles.bottomBar]}>
            <Pressable 
              onPressIn={()=>{setPressed(true)}}
              onPressOut={()=>{setPressed(false)}}
              onPress={()=>{capture()}}
            >
              <View style={styles.outerCircle}>
                <View style={[styles.innerCircle, pressed ? styles.circlePressed:null]}></View>
              </View>
            </Pressable>
            <Pressable onPress={scanID} className={`mt-8 rounded-xl bg-[#00669D] w-56 h-fit py-4 flex items-center justify-center`}>
              <Text className='text-xl text-white font-bold'>Back</Text>
            </Pressable>
          </View>
        </View>    
        :  
        <View className='h-screen items-center -top-40 justify-center p-4 px-10'>
          {imageUri && 
            <Image
              // source={{uri: "data:image/png;base64,"+capturedImage}}
              source={{uri: imageUri}}
              style={{height: 160, width: 340, transform: [{rotate: '180deg'}], borderRadius: 10 }}
            />
          }
          <View className='items-center justify-center'>
            <Pressable onPress={btnPressed} className={`mt-4 rounded-xl bg-[#00669D] w-[320px] h-fit py-4 flex items-center justify-center`}>
              <Text className='text-xl text-white font-bold'>Next</Text>
            </Pressable>
          </View>
        </View>
      }
    </>
  )
};

const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  outerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  circlePressed: {
    backgroundColor: 'gray',
  },
});

export default CameraScreen;
