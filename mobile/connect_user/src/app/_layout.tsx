import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <Stack>
      <StatusBar style="light" />
      {/* The auth stack is defined in (auth)/_layout.tsx */}
      {/* The tabs stack is defined in (tabs)/_layout.tsx */}
    </Stack>
  );
}