import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import orders from "@assets/data/orders";
import OrderListItem from "@/components/OrderListItem";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      {orders.map((order) => (
        <OrderListItem orderItem={order} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
