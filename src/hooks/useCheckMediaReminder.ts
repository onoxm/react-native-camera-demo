import { useStore } from "@/store";
import { router } from "expo-router";
import { Alert } from "react-native";

export const useCheckMediaReminder = () => {
  const checkMediaReminder = useStore("checkMediaReminder");

  const checkMediaReminderFn = () => {
    if (checkMediaReminder) {
      Alert.alert("Media saved", "Would want check your media?", [
        {
          text: "Never remind me",
          onPress: () => {
            useStore.setState({ checkMediaReminder: false });
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Go to Gallery",
          onPress: () => router.push("/gallery"),
        },
      ]);
    }
  };

  return { checkMediaReminder: checkMediaReminderFn };
};
