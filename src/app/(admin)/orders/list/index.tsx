import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import OrderListItem from "@/components/OrderListItem";
import { useAdminOrderList } from "@/api/orders";

export default function TabTwoScreen() {
  const { data: orders, error, isLoading } = useAdminOrderList({archived: false});

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error while fethcing the orders</Text>;
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
