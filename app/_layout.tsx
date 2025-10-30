import { Stack } from 'expo-router';
import { AuthProvider, AlertProvider } from '@/template';
import { ERPProvider } from '@/contexts/ERPContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <AuthProvider>
        <ERPProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ERPProvider>
      </AuthProvider>
    </AlertProvider>
  );
}