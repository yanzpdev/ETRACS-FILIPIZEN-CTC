import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, StatusBar, Pressable } from 'react-native';

type HeaderProps = {
  inForms: boolean;
  backBtn?: () => void;
}

const Header: React.FC<HeaderProps> = ({inForms, backBtn}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View className='' style={styles.override}>
        <View className='bg-transparent flex items-center justify-center' style={styles.header}>
          <Image 
            source={require('@/assets/images/etracslogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
      {inForms &&
        <Pressable
          onPress={backBtn}
          className='absolute h-full'
          style={styles.backButton}
        >
          <FontAwesome6 name="arrow-left" size={25} color="black" />
        </Pressable>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    elevation: 10,
    paddingTop: 30.5,
  },

  override: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    paddingHorizontal: 25,
    top: 62
  },

  header: {
    height: 90, 
  },
  
  logo: {
    width: 160, 
    height: 60, 
  },
});

export default Header;
