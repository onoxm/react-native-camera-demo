import { Host, Icon } from "@expo/ui";
import { CameraMode } from "expo-camera";
import { Pressable, View } from "react-native";

interface CameraModeSwitchBar {
  cameraMode: CameraMode;
  disabled: boolean;
  cameraBtnList: {
    type: string;
    icon: any;
    onPress: () => void;
  }[];
}

export const CameraModeSwitchBar = ({
  disabled,
  cameraMode,
  cameraBtnList,
}: CameraModeSwitchBar) => {
  return (
    <View className="absolute bottom-44 w-full items-center">
      <View className="flex-row gap-1 rounded-full bg-black/60 p-1">
        {cameraBtnList.map(({ type, icon, onPress }) => (
          <Pressable
            key={type}
            className={`size-12 items-center justify-center rounded-full disabled:opacity-50 ${cameraMode === type ? "bg-white" : ""}`}
            disabled={disabled}
            onPress={onPress}
          >
            <Host matchContents>
              <Icon
                name={icon}
                size={24}
                color={cameraMode === type ? "black" : "white"}
              />
            </Host>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
