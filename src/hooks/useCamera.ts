import { CameraMode, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";

export const useCamera = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraMode, setCameraMode] = useState<CameraMode>("picture");
  const [cameraReady, setCameraReady] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);

  return {
    facing,
    setFacing,
    permission,
    requestPermission,
    cameraMode,
    setCameraMode,
    cameraReady,
    setCameraReady,
    takingPhoto,
    setTakingPhoto,
  };
};
