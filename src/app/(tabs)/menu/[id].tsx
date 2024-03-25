import { View, Text } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";

const product = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Stack.Screen options={{ title: "Details: " + id }} />
      <Text style={{ fontSize: 20 }}>Product detail for id {id}</Text>
    </View>
  );
};
//1.01.50
export default product;
