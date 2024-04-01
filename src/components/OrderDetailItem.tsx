import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { OrderItem, Tables } from "@/types";
import { defaultPizzaImage } from "./ProductListItem";
import Colors from "@/constants/Colors";

type OrderDetailItemProps = {
  orderItem: Tables<"order_items"> & { products: Tables<"products"> };
};

const OrderDetailItem = ({ orderItem }: OrderDetailItemProps) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: orderItem.products.image || defaultPizzaImage }}
      />
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20 }}>{orderItem.products.name}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.price}>
            ${orderItem.products.price * orderItem.quantity}{" "}
          </Text>
          <Text style={styles.size}>Size: {orderItem.size}</Text>
        </View>
      </View>
      <Text style={styles.quantity}>{orderItem.id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    marginVertical: 5,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  image: {
    height: 60,
    aspectRatio: 1,
  },
  titleContainer: {
    flex: 1,
    padding: 10,
  },
  price: {
    color: Colors.light.tint,
    fontSize: 14,
    fontWeight: "bold",
  },
  size: {
    fontSize: 14,
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OrderDetailItem;
