import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

const ProductListItem = (props: any) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: props.product.image }} style={styles.image} />
      <Text style={styles.title}>{props.product.name}</Text>
      <Text style={styles.price}>{props.product.price}</Text>
    </View>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
