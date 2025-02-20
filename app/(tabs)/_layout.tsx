import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function TabsLayout() {
  return (
    <>
      <Tabs>
        {/* 1) Home tab */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: 'Home',
            title: 'Home Page',
          }}
        />

        {/* 2) Reminders tab */}
        <Tabs.Screen
          name="reminders"
          options={{
            tabBarLabel: 'Reminders',
            title: 'Reminders Page',
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </>
  );
}
