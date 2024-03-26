import { View, StyleSheet, FlatList } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import orders from "@assets/data/orders";
import OrderListItem from "@/components/OrderListItem";
import OrderDetailItem from "@/components/OrderDetailItem";

const OrderDetailsPage = () => {
  const { id } = useLocalSearchParams();
  const order = orders.find((o) => o.id.toString() === id);
  if (!order) {
    return;
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order?.id}` }} />
      <OrderListItem orderItem={order} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => (
          <OrderDetailItem key={item.id} orderItem={item} />
        )}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 20,
  },
  flatList: {
    gap: 10,
  },
});

export default OrderDetailsPage;
