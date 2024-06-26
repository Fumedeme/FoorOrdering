import { useAuth } from "@/provider/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { session } = useAuth();

  if (session) {
    return <Redirect href={"/"} />;
  }
  return (
    <Stack>
      <Stack.Screen name="signIn" options={{ title: "Sign In" }} />
      <Stack.Screen name="signUp" options={{ title: "Sign Up" }} />
    </Stack>
  );
}
