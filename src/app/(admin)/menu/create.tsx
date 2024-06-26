import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import RemoteImage from "@/components/RemoteImage";

const create = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<string | null>();
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
    null
  );

  const router = useRouter();

  let { id: idString } = useLocalSearchParams();
  const isUpdating = !!idString;
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
  );

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { data: updatingProduct } = useProduct(id);

  //While updating a product, fill the fields automatically acording to the id
  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setImage(updatingProduct.image);
      setPrice(updatingProduct.price.toString());
    }
  }, [updatingProduct]);

  const resetFields = () => {
    setName("");
    setPrice("");
    setErrors("");
  };

  const validateInput = () => {
    if (!name) {
      setErrors("Name is mandatory");
      return false;
    }
    if (!price) {
      setErrors("Price is mandatory");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors("Price is not a number");
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };
  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    if (uploadedImagePath !== null) {
      insertProduct(
        { name, price: parseFloat(price), image: uploadedImagePath },
        {
          onSuccess: () => {
            resetFields();
            router.back();
          },
        }
      );
    }
  };

  const onUpdate = async () => {
    if (!validateInput()) {
      return;
    }

    if (uploadedImagePath !== null) {
      updateProduct(
        { id, name, price: parseFloat(price), image: uploadedImagePath },
        {
          onSuccess: () => {
            resetFields();
            router.back();
          },
        }
      );
    }
  };

  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace("/(admin)");
      },
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (image2: string) => {
    if (!image2?.startsWith("file://")) {
      return;
    }

    try {
      const base64 = await FileSystem.readAsStringAsync(image2, {
        encoding: "base64",
      });
      const filePath = `${randomUUID()}.png`;
      const contentType = "image/png";

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, decode(base64), { contentType });

      console.log(error);

      if (data) {
        setImage(data.path);
        setUploadedImagePath(data.path);
      }
    } catch (error) {
      console.log("genel hata", error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />
      <RemoteImage
        path={image}
        fallback={defaultPizzaImage}
        style={styles.image}
      />
      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="9.99"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
      />

      <Text style={{ color: "red" }}>{errors}</Text>
      <Button text={isUpdating ? "update" : "Create"} onPress={onSubmit} />
      {isUpdating && (
        <Text onPress={confirmDelete} style={styles.textButton}>
          Delete
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default create;
