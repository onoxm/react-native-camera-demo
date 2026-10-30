import { useMedia } from "@/hooks/useMedia";
import { useStore } from "@/store";
import { Media } from "@/types/media";
import { Host, Icon } from "@expo/ui";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { StyledImage } from "./StyledImage";

export const MediaCard = ({ media }: { media: Media }) => {
  const { deleteMediaFromGallery } = useMedia();

  const sharePhoto = async () => {
    const isAvailable = await isAvailableAsync();
    if (!isAvailable) {
      return Alert.alert("Sharing is not available");
    }

    await shareAsync(media.uri, {
      dialogTitle: "Share photo",
      mimeType: media.type === "picture" ? "image/jpeg" : "video/mp4",
      UTI: media.type === "picture" ? "public.jpeg" : "public.mp4",
    });
  };

  const handleLongPress = () => {
    Alert.alert("Options", "What would you like to do?", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Are you sure?", "This action cannot be undone.", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await deleteMediaFromGallery(media.id);
                useStore.setState(({ medias }) => ({
                  medias: medias.filter((m) => m.id !== media.id),
                }));
              },
            },
          ]);
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Share",
        style: "cancel",
        onPress: sharePhoto,
      },
    ]);
  };

  return (
    <View
      key={media.id}
      className="bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden aspect-square mb-3 w-[48.5%]"
    >
      <TouchableOpacity onLongPress={handleLongPress}>
        <StyledImage
          source={{ uri: media.uri }}
          contentFit="cover"
          className="size-full"
        />
      </TouchableOpacity>

      {media.type === "video" && (
        <View className="absolute right-2 top-2 size-8 items-center justify-center rounded-full bg-black/60">
          <Host matchContents>
            <Icon
              name={Icon.select({
                ios: "play.fill",
                android: import("@expo/material-symbols/play_arrow.xml"),
              })}
              size={17}
              color="#fff"
            />
          </Host>
        </View>
      )}
    </View>
  );
};
