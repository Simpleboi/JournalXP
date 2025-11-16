import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'JournalXP',
          }}
        />
        <Stack.Screen
          name="journal"
          options={{
            title: 'Journal',
          }}
        />
        <Stack.Screen
          name="auth"
          options={{
            title: 'Sign In',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
