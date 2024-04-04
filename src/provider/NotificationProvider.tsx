import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { supabase } from "@/lib/supabase";
import * as Notifications from "expo-notifications";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const { session } = useAuth();
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const saveToken = async (token2: string | undefined) => {
    setExpoPushToken(token2);

    if (!token2) return;

    if (!session?.user.id) return;

    try {
      await supabase
        .from("profiles")
        .update({ expo_push_token: token2 })
        .eq("id", session?.user.id);
    } catch (error) {
      console.log("Error while saving user token", error);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => saveToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );

      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  console.log("push notf token", expoPushToken);
  console.log("Noficitonsa", notification);

  return <>{children}</>;
};

export default NotificationProvider;
