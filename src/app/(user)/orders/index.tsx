import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import OrderListItem from "@/components/OrderListItem";
import { useMyOrderList } from "@/api/orders";

export default function TabTwoScreen() {
  const { data: orders, isLoading, error } = useMyOrderList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>There was an error fetching the orders</Text>;
  }
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem orderItem={item} />}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },
});
