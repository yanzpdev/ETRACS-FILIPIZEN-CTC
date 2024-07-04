import { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, Alert, BackHandler } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Violations } from '@/app/interfaces';
import { FormData } from '@/app/interfaces';

type Form2Props = {
  formData: FormData;
  setFormData: any;
  goToNext: () => void;
  goToPrevious: () => any;
}

const Form2:React.FC<Form2Props> = ({formData, setFormData, goToNext, goToPrevious}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedViolations, setSelectedViolations] = useState<Violations[]>(formData.violations || []);
  const [dropdownHeight, setDropdownHeight] = useState(70);
  const violationList = [
    {
      violationId: '1',
      ordinance: '1361',
      title: 'II',
      article: '3',
      desc: 'Failure to clean sorrounding area five meters from the nearest unenclosed residences, vendor stalls, and commercial establishments.'
    },
    {
      violationId: '2',
      ordinance: '1361',
      title: 'II',
      article: '5',
      desc: 'No proper waste receptacle of unenclosed residences, vendor stalls, and commercial establishments.'
    },
    {
      violationId: '3',
      ordinance: '1361',
      title: 'II',
      article: '8',
      desc: 'Spitting, urinating, and defecating, in public places.'
    },
    {
      violationId: '4',
      ordinance: '1361',
      title: 'II',
      article: '9',
      desc: 'Littering'
    },
    {
      violationId: '5',
      ordinance: '1361',
      title: 'II',
      article: '10',
      desc: 'Posting grafitti, posters, handbills on walls.'
    },
    {
      violationId: '6',
      ordinance: '1362',
      title: 'I',
      article: '1',
      desc: 'Violation not related to ordinance 1361.'
    },
    {
      violationId: '7',
      ordinance: '1363',
      title: 'I',
      article: '1',
      desc: 'Violation not related to ordinance 1361 and 1362.'
    },
  ]

  useEffect(() => {
    const backAction = () => {
      goToPrevious();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const toggleViolationSelection = (violation: Violations) => {
    setSelectedViolations((prevSelected) => {
      const isSelected = prevSelected.some((v) => v.violationId === violation.violationId);
      let updatedSelection;
      if (isSelected) {
        updatedSelection = prevSelected.filter((v) => v.violationId !== violation.violationId);
      } 
      
      else {
        updatedSelection = [...prevSelected, violation];
      }
      setFormData({ ...formData, violations: updatedSelection });
      return updatedSelection;
    });
  };

  // const selectedOrdinances = Array.from(new Set(selectedViolations.map(v => v.ordinance)));

  // useEffect(() => {
  //   const calculateDropdownHeight = () => {
  //     const selectedLength = selectedOrdinances.length;
  //     if (selectedLength <= 1) {
  //       return 70;
  //     } else {
  //       return 70 + (selectedLength - 1) * 30;
  //     }
  //   };

  //   setDropdownHeight(calculateDropdownHeight());
  // }, [selectedOrdinances]);

  const groupByOrdinance = (violations: Violations[]) => {
    return violations.reduce((acc, violation) => {
      if (!acc[violation.ordinance]) {
        acc[violation.ordinance] = [];
      }
      acc[violation.ordinance].push(violation);
      return acc;
    }, {} as Record<string, Violations[]>);
  };


  const groupedViolations = groupByOrdinance(violationList);

  const displaySelectedViolations = () => {
    if (formData.violations.length === 0) {
      return '';
    } else {
      // group violations by ordinance
      const groupedByOrdinance: Record<string, string[]> = {};
  
      formData.violations.forEach(violation => {
        const key = `Ordinance ${violation.ordinance}`;
        if (!groupedByOrdinance[key]) {
          groupedByOrdinance[key] = [];
        }
        groupedByOrdinance[key].push(`Title ${violation.title} Art. ${violation.article}`);
      });
  
      // initialize text
      let displayText = '';
      Object.keys(groupedByOrdinance).forEach(key => {
        const violations = groupedByOrdinance[key];
        const truncatedTitles = violations.join(', ').substring(0, 55);
        const textToAdd = violations.length > 3 ? `${truncatedTitles}...` : truncatedTitles;
        displayText += `${key}: ${textToAdd}\n`;
      });
  
      return displayText.trim(); // trim to remove whitespace
    }
  };

  const isViolationsEmpty = !Array.isArray(formData.violations) || formData.violations.length === 0;

  return (
    <ScrollView className='h-screen p-10'>
      <View className='flex-row justify-between items-center' style={{zIndex: 40}}>
        <Text className='text-2xl font-semibold'>Violation</Text>
        <Pressable className={`right-3 top-[70px]`} onPress={() => setShowDropdown(!showDropdown)}>
          {!showDropdown ?
            <Entypo name="chevron-thin-down" size={20} color="#636363" />
          :
            <Entypo name="chevron-thin-up" size={20} color="#636363" />
          }
        </Pressable>
      </View>
      <Text style={{zIndex: 40}} className='text-[#AEABAB] top-8 z-10 left-[15px] font-semibold'>Violation/s</Text>
      <Pressable 
        onPress={() => setShowDropdown(!showDropdown)} 
        style={{zIndex: 30}} 
        className={`w-max px-3 pt-10 p-5 overflow-scroll bg-[#E9EDEE] rounded-xl text-[#636363] text-lg font-semibold`}
      >
        <Text className='text-[#636363] px-[5px] -top-1 font-semibold'>
          {displaySelectedViolations()}
        </Text>      
      </Pressable>
      {showDropdown &&
        <Pressable 
          style={{zIndex: 20, elevation: 5}} 
          className='w-max px-3 h-96 overflow-scroll -top-10 pt-4 bg-[#f8f8f8] rounded-xl text-[#636363] text-lg font-semibold'
        >
          <ScrollView className='mt-8 mb-5 px-3' overScrollMode='never'>
          {Object.keys(groupedViolations).map(ordinance => (
              <View key={ordinance}>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-xl font-bold'>Ordinance {ordinance}: </Text>
                  <Text className='text-xl font-bold'>{ordinance === '1361' ? 'Anti-Littering Ordinance' : 'Other Ordinance Title'}</Text>
                </View>
                {groupedViolations[ordinance].map(violation => (
                  <Pressable
                    className='flex-row my-3 gap-5 justify-start items-start'
                    key={violation.violationId}
                    onPress={() => toggleViolationSelection(violation)}
                  >
                    <FontAwesome5 name="check-circle" size={24} color={`${formData.violations.some((v) => v.violationId === violation.violationId) ? '#63ed92' : '#AEABAB'}`} />
                    <View className='flex-row items-center justify-between w-[90px]'>
                      <Text className='font-bold'>Title {violation.title}</Text>
                      <Text className='font-bold'>Art. {violation.article}</Text>
                    </View>
                    <View className='w-[270px]'>
                      <Text className='font-semibold text-justify'>
                        {violation.desc}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ))}
          </ScrollView>
        </Pressable>
      }
      {!showDropdown &&
        <View className='items-center justify-center'>
          <Pressable 
            onPress={goToNext} 
            style={{zIndex: 10}} 
            disabled={isViolationsEmpty}
            className={`mt-4 rounded-xl ${!isViolationsEmpty ? 'bg-[#00669D]' : 'bg-[#6aadd0]'} w-[320px] h-fit py-4 flex items-center justify-center`}
          >
            <Text className='text-xl text-white font-bold'>Next</Text>
          </Pressable>
          <Pressable 
            onPress={goToPrevious} 
            style={{zIndex: 10}} 
            className='mt-4 rounded-xl bg-white border w-[320px] h-fit py-4 flex items-center justify-center'
          >
            <Text className='text-xl font-bold'>Back</Text>
          </Pressable>
        </View>
      }
    </ScrollView>
  )
}

export default Form2;