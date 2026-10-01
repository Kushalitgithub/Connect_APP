import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function TabsLayout() {
  return (
    <Tabs>
      <StatusBar style="light" />
      {/* Define your tab screens here */}
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="find" options={{ title: 'Find' }} />
      <Tabs.Screen name="verification-status" options={{ title: 'Verification' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="inbox" options={{ title: 'Messages' }} />
    </Tabs>
  );
}