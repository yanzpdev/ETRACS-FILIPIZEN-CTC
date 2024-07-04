import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen 
        name='index'
      />
      <Stack.Screen 
        name='login/index'
      />
      <Stack.Screen 
        name='dashboard'
      />
    </Stack>
  )
}