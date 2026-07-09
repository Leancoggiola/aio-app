import { Tabs } from 'expo-router';
import { Paragraph } from 'tamagui';

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Paragraph size="$1" fontWeight={focused ? '700' : '400'}>
      {label}
    </Paragraph>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarLabel: ({ focused }) => <TabLabel label="Inicio" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Media',
          tabBarLabel: ({ focused }) => <TabLabel label="Media" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: ({ focused }) => <TabLabel label="Perfil" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
