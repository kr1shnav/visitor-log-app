import { Stack } from "expo-router";

import { VisitorProvider } from "../context/VisitorContext";

export default function Layout() {
  return (
    <VisitorProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1E293B",
          },

          headerTintColor: "#fff",

          contentStyle: {
            backgroundColor: "#F8FAFC",
          },

          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />

        <Stack.Screen
          name="new-visitor"
          options={{
            title: "New Visitor",
          }}
        />

        <Stack.Screen
          name="active-visitors"
          options={{
            title: "Active Visitors",
          }}
        />

        <Stack.Screen
          name="reports"
          options={{
            title: "Reports",
          }}
        />
      </Stack>
    </VisitorProvider>
  );
}
