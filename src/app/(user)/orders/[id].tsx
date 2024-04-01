import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@/components/OrderListItem";
import OrderDetailItem from "@/components/OrderDetailItem";
import { useOrderDetails } from "@/api/orders";

const OrderDetailsPage = () => {
  const { id: idString } = useLocalSearchParams();
  //id can be in shape of an array this is why we had to check if its an array take the first element of it
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const { data: order, isLoading, error } = useOrderDetails(id);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>There was an error fetching the data</Text>;
  }

  if (!order || order.order_items) {
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
