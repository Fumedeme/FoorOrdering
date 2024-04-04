import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@/components/OrderListItem";
import OrderDetailItem from "@/components/OrderDetailItem";
import { OrderStatusList, Tables } from "@/types";
import Colors from "@/constants/Colors";
import { useOrderDetails, useUpdateOrder } from "@/api/orders";
import { notifyUserAboutOrderUpdate } from "@/lib/notifications";

const OrderDetailsPage = () => {
  const { id: idString } = useLocalSearchParams();
  //id can be in shape of an array this is why we had to check if its an array take the first element of it
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const { data: order, isLoading, error } = useOrderDetails(id);

  const { mutate: updateOrder } = useUpdateOrder();

  const updateStatus = async (status: string) => {
    updateOrder({
      id: id,
      updatedFields: {
        status,
      },
    });

    if (order)
      await notifyUserAboutOrderUpdate(order?.user_id, { ...order, status });
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>There was an error fetching the data</Text>;
  }

  if (!order) {
    return;
  }

  //TODO: Workaround for turning a type into non nullable type
  type NonNullOrderItem = Tables<"order_items"> & {
    products: Tables<"products">;
  };

  const nonNullOrderItems: NonNullOrderItem[] = order.order_items.filter(
    (item): item is NonNullOrderItem => item.products !== null
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order?.id}` }} />

      <FlatList
        data={nonNullOrderItems}
        renderItem={({ item }) => (
          <OrderDetailItem key={item.id} orderItem={item} />
        )}
        contentContainerStyle={styles.flatList}
        ListHeaderComponent={() => <OrderListItem orderItem={order} />}
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: "bold" }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => updateStatus(status)}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order.status === status
                        ? Colors.light.tint
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? "white" : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
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
