// app/_layout.tsx
import { Stack } from 'expo-router';
import { ParksProvider } from '../contexts/ParksContext';

export default function RootLayout() {
  return (
    <ParksProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="park-detail" options={{ headerShown: false }} />
      </Stack>
    </ParksProvider>
  );
}