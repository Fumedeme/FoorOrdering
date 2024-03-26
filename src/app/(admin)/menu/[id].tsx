import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React, { useState } from "react";
import {
  Href,
  Link,
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import products from "@assets/data/products";
import Button from "@/components/Button";
import { CartType, useCart } from "@/provider/CartProvider";
import { PizzaSize } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const product = () => {
  const { id } = useLocalSearchParams();
  const product = products.find((p) => p.id.toString() === id);
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");
  const { addItem }: CartType = useCart();
  const router = useRouter();

  if (!product) {
    return <Text>Product is not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Details",
          headerRight: () => (
            <Link
              href={
                `/(admin)/menu/create?id=${id}` as Href<`/(admin)/menu?id=${number}`>
              }
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen options={{ title: product.name }} />

      <Image source={{ uri: product.image }} style={styles.image} />

      <Text style={styles.title}>${product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
  },
});
export default product;
