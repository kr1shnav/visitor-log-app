import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1E293B",
        },
        headerTintColor: "#fff",
        contentStyle: {
          backgroundColor: "#F8FAFC",
        },
      }}
    />
  );
}