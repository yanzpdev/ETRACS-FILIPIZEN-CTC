import { View, BackHandler, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { router } from 'expo-router';
import { PaperProvider } from 'react-native-paper'
import Form1 from './forms/Form1';
import Form2 from './forms/Form2';
import Form3 from './forms/Form3';
import Preview from './forms/Preview';
import ThermalPrinterModule from 'react-native-thermal-printer';
import { Violations } from '@/app/interfaces';
import { getSession, saveTicketRecord } from '@/utils/database';
import CameraScreen from '../../main/CameraScreen';
// import CameraScreen from '../../main/CameraScreen';

export default function PersonScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<any>();
  const [scanScreen, setScanScreen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: '',
    contactNum: '',
    email: '',
    address: '',
    violations: [],
    signature: '',
    printed: false
  });
  const goToNext = () => setCurrentStep((prevStep) => prevStep + 1);
  const goToPrevious = () => setCurrentStep((prevStep) => prevStep - 1);

  useEffect(() => {
    const checkSession = async () => {
      await getSession((user: any) => {
        if (user) {
          setUser(user);    
        }
        
        else {
          console.error("no user data");
        }
      });
    };

    checkSession();
  }, []);


  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  function formatTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; 
  
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
    const formattedTime = hours + ':' + formattedMinutes + ' ' + ampm;
  
    return formattedTime;
  }
  const currentTime = formatTime();
  const formatReceipt = (formData: any) => {
    let receipt = '';
    // receipt += `[C]<img>${url}</img>\n\n`;
    receipt += `[C]<img>https://filipizen.com/resources/04718.png</img>\n\n`;
    receipt += `[C]City of the Mayor\n`;
    receipt += `[C]<b>CEBU ENVIRONMENTAL SANITATION</b>\n`;
    receipt += `[C]<b>ENFORCEMENT TEAM</b>\n`;
    receipt += `[C]<b>(CESET)</b>\n`;
    receipt += `[L]\n`;
    receipt += `[L]<b>CITATION TICKET</b>[R]<b>No. <font size="big">04101</font></b>\n`;
    receipt += `[L]\n`;
    receipt += `[C]================================\n`;
    receipt += `[L]\n`;
    receipt += `[L]To: \n${formData.fullName}\n\n`;
    receipt += `[L]Contact Number: \n${formData.contactNum}\n\n`;
    receipt += `[L]Email: \n${formData.email}\n\n`;
    receipt += `[L]Address: \n${formData.address}\n\n`;
    receipt += `[L]Date: \n${currentDate}\n\n`;
    receipt += `[L]Time: \n${currentTime}\n\n`;

    receipt += 'Violations:\n';
    const violationsByOrdinance: { [key: string]: Violations[] } = {};
    formData.violations.forEach((violation: Violations) => {
      const { ordinance } = violation;
      if (violationsByOrdinance[ordinance]) {
        violationsByOrdinance[ordinance].push(violation);
      } else {
        violationsByOrdinance[ordinance] = [violation];
      }
    });
    
    // Step 2: Construct the receipt string grouped by ordinance    
    Object.keys(violationsByOrdinance).forEach((ordinance) => {
      receipt += `Ordinance ${ordinance}:\n`;
      violationsByOrdinance[ordinance].forEach((violation, index) => {
        receipt += `${index + 1}. Title ${violation.title} Art. ${violation.article} - ${violation.desc}\n`;
      });
      receipt += '\n'; 
    });

    receipt += '\n';
    receipt += `<img>${formData.signature}</img>\n\n`;
    receipt += `[C]<b>${formData.fullName.toUpperCase()}</b>\n`;
    return receipt;
  };
  const handleSubmit = async () => {
    const receipt = formatReceipt(formData);
    // console.log(receipt);
    try {
      // await saveTicketRecord(user?.id, formData);

      await ThermalPrinterModule.printBluetooth({
        payload: receipt,
        printerWidthMM: 50,
        printerNbrCharactersPerLine: 32,
      });
    } 
    
    catch (err: any) {
      console.log(err.message);
    }
  };

  const scanID = () => {
    if (currentStep === 1) {
      goToPrevious();
    }

    else if (currentStep < 1) {
      setCurrentStep(1);
    }
    setScanScreen(!scanScreen);
  }

  const prevRoute = () => {
    Alert.alert(
      "Return to Home Screen",
      "Changes will not be saved. Continue?",
      [
        {
          text: "No",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Yes", onPress: () => router.back() }
      ],
      { cancelable: false }
    );
    return true;
  }

  return (
    <PaperProvider>
      <View className='bg-white h-[110vh]'>
        <Header inForms={true} backBtn={prevRoute}/>
        {scanScreen &&
          <CameraScreen scanID={scanID} setFormData={setFormData} formData={formData} />
        }
        {currentStep === 1 && (
          <Form1 
            prevRoute={prevRoute}
            formData={formData}
            setFormData={setFormData}
            goToNext={goToNext}
            scanID={scanID}
          />
        )}
        {currentStep === 2 && (
          <Form2
            formData={formData}
            setFormData={setFormData}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
          />
        )}
        {currentStep === 3 && (
          <Form3
            formData={formData}
            setFormData={setFormData}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            handleSubmit={handleSubmit}
          />
        )}
        {currentStep === 4 && (
          <Preview
            formData={formData}
            setFormData={setFormData}
            goToPrevious={goToPrevious}
            handleSubmit={handleSubmit}
          />
        )}
      </View>
    </PaperProvider>
  )
}