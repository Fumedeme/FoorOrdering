import { View, Text, Button } from "react-native";
import React from "react";
import { supabase } from "@/lib/supabase";

const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>

      <Button
        title="Sign Out"
        onPress={async () => await supabase.auth.signOut()}
      />
    </View>
  );
};

export default ProfileScreen;
