import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366f1',
    primaryContainer: '#e0e7ff',
    secondary: '#64748b',
    surface: '#ffffff',
    background: '#f8fafc',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#818cf8',
    primaryContainer: '#3730a3',
    secondary: '#94a3b8',
    surface: '#1e293b',
    background: '#0f172a',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.onSurface,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Simple Chat Bots',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="chat" 
          options={{ 
            title: 'Chat',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Settings',
            presentation: 'modal'
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}