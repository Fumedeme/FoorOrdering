import { Stack } from "expo-router";

export default function () {
  return (
    <Stack>
      <Stack.Screen name="list" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{}} />
    </Stack>
  );
}
