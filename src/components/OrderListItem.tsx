import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";

import { Href, Link, useSegments } from "expo-router";
import { Tables } from "@/database.types";

type Order = Tables<"orders">;

type OrderListItemProps = {
  orderItem: Order;
};

const OrderListItem = ({ orderItem }: OrderListItemProps) => {
  const segments = useSegments();
  const calculateTimePassed = () => {
    const pastDate = new Date(orderItem.created_at);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - pastDate.getTime();
    const differenceInHours = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60)
    );

    return `${differenceInHours} hours ago`;
  };

  return (
    <Link
      href={
        `/${segments[0]}/orders/${orderItem.id}` as Href<`/${string}/orders/${number}`>
      }
      asChild
    >
      <Pressable style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { fontWeight: "bold" }]}>
            Order #{orderItem.id}
          </Text>
          <Text style={styles.time}>{calculateTimePassed()}</Text>
        </View>
        <Text style={styles.title}>{orderItem.status}</Text>
      </Pressable>
    </Link>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    marginVertical: 5,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    marginBottom: 5,
  },
  time: {
    fontSize: 10,
    color: "gray",
    fontWeight: "bold",
  },
});

export default OrderListItem;
