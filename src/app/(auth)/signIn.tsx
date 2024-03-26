import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

const signIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const onSubmit = () => {
    console.warn("Signing in");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        secureTextEntry={true}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button text="Sign In" onPress={onSubmit} />
      <Text
        onPress={() => router.push("/(auth)/signUp")}
        style={styles.textButton}
      >
        Create an account
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: "black",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default signIn;
