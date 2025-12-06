import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'OpenSpoolMan' }} />
        <Stack.Screen name="write" options={{ title: 'Write NFC Tag' }} />
        <Stack.Screen name="read" options={{ title: 'Read NFC Tag' }} />
        <Stack.Screen name="spool-info" options={{ title: 'Spool Info' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
