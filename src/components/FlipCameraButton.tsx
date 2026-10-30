import { Text, TouchableOpacity } from "react-native";

export const FlipCameraButton = ({
  disabled,
  toggleCameraFacing,
}: {
  disabled: boolean;
  toggleCameraFacing: () => void;
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      className="absolute top-16 right-4 rounded-full bg-black/50 px-4 py-3 disabled:opacity-50"
      onPress={toggleCameraFacing}
    >
      <Text className="font-semibold text-white">Flip Camera</Text>
    </TouchableOpacity>
  );
};
