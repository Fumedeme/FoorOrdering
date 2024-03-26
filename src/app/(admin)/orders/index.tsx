import { FlatList, StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import orders from "@assets/data/orders";
import OrderListItem from "@/components/OrderListItem";

export default function TabTwoScreen() {
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
