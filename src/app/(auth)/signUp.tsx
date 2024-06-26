import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

const signUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateInput = () => {
    if (!email) {
      setErrors("Email is mandatory");
      return false;
    }
    if (!password) {
      setErrors("Password is mandatory");
      return false;
    }

    return true;
  };

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setErrors("");
  };

  const signUpWithEmail = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) setErrors(error.message);

    setLoading(false);
  };

  const onSubmit = () => {
    if (!validateInput()) {
      return;
    }
    signUpWithEmail();

    resetFields();
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

      <Button
        disabled={loading}
        text={loading ? "Creating account..." : "Create account"}
        onPress={onSubmit}
      />
      <Text onPress={() => router.back()} style={styles.textButton}>
        Sign In
      </Text>

      <Text style={{ color: "red" }}>{errors}</Text>
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

export default signUp;
