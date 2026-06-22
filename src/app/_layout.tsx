import { Stack } from 'expo-router';

import { PaperProvider } from 'react-native-paper';

import { VisitorProvider } from '../context/VisitorContext';

export default function Layout() {
  return (
    <PaperProvider>
      <VisitorProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#002b55',
            },

            headerTintColor: '#ffffff',

            contentStyle: {
              backgroundColor: '#ffffff',
            },

            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen
            name='index'
            options={{
              title: 'Home',
            }}
          />

          <Stack.Screen
            name='new-visitor'
            options={{
              title: 'New Visitor',
            }}
          />

          <Stack.Screen
            name='active-visitors'
            options={{
              title: 'Active Visitors',
            }}
          />

          <Stack.Screen
            name='reports'
            options={{
              title: 'Reports',
            }}
          />
        </Stack>
      </VisitorProvider>
    </PaperProvider>
  );
}