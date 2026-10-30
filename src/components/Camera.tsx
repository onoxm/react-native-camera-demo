import { useCheckMediaReminder } from "@/hooks/useCheckMediaReminder";
import { useMedia } from "@/hooks/useMedia";
import { useStore } from "@/store";
import { Host, Icon } from "@expo/ui";
import { CameraView } from "expo-camera";
import { usePermissions } from "expo-media-library";
import { useRef } from "react";
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import { useCamera } from "../hooks/useCamera";
import { useVideo } from "../hooks/useVideo";
import { CameraModeSwitchBar } from "./CameraModeSwitchBar";
import { FlipCameraButton } from "./FlipCameraButton";
import { StyledCameraView } from "./StyledCameraView";

export default function CameraViewDemo() {
  const [libraryPermission, requestLibraryPermission] = usePermissions();
  const medias = useStore("medias");
  const { checkMediaReminder } = useCheckMediaReminder();
  const { addMediaToGallery } = useMedia();

  const {
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
  } = useCamera();

  const {
    isRecording,
    setIsRecording,
    microphonePermission,
    requestMicrophonePermission,
    recordMinutes,
    recordSeconds,
  } = useVideo();

  const isCameraDisabled = !cameraReady || takingPhoto;

  const cameraViewRef = useRef<CameraView>(null);

  if (!permission || !libraryPermission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 flex justify-center items-center">
        <Text className="text-center pb-10 dark:text-white">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (!libraryPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 flex justify-center items-center">
        <Text className="text-center pb-10 dark:text-white">
          We need your permission to save media
        </Text>
        <Button onPress={requestLibraryPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleTakePhoto = async () => {
    if (!cameraViewRef.current || isCameraDisabled) return;

    setTakingPhoto(true);
    try {
      const picRef = await cameraViewRef.current?.takePictureAsync({
        quality: 1,
      });

      const asset = await addMediaToGallery(picRef.uri);

      useStore.setState({
        medias: [
          ...medias,
          {
            id: asset.id,
            uri: picRef.uri,
            type: "picture",
          },
        ],
      });

      checkMediaReminder();
    } catch (error) {
    } finally {
      setTakingPhoto(false);
    }
  };

  const handleScan = ({ data, type }: { data: string; type: string }) => {
    console.log(`Scanned ${type}: ${data}`);
    // 同样建议加防抖，或扫到后立即关闭相机
  };

  const cameraBtnList = [
    {
      type: "picture",
      icon: Icon.select({
        ios: "camera.fill",
        android: import("@expo/material-symbols/photo_camera.xml"),
      }),
      onPress: () => {
        setCameraMode("picture");
      },
    },
    {
      type: "video",
      icon: Icon.select({
        ios: "video.fill",
        android: import("@expo/material-symbols/videocam.xml"),
      }),
      onPress: () => {
        setCameraMode("video");
      },
    },
  ];

  const handleRecord = async () => {
    if (!cameraViewRef.current || !cameraReady) return;

    if (isRecording) {
      cameraViewRef.current.stopRecording();
      setIsRecording(false);
    }

    let hasMicrophonePermission = microphonePermission?.granted ?? false;

    if (!hasMicrophonePermission) {
      const result = await requestMicrophonePermission();
      hasMicrophonePermission = result.granted;
    }

    if (!hasMicrophonePermission) {
      Alert.alert(
        "Microphone permission required",
        "Please grant microphone permission to record video.",
      );
      return;
    }

    setIsRecording(true);

    try {
      const video = await cameraViewRef.current.recordAsync();

      if (video) {
        const asset = await addMediaToGallery(video.uri);

        useStore.setState({
          medias: [
            ...medias,
            {
              id: asset.id,
              uri: video.uri,
              type: "video",
            },
          ],
        });

        checkMediaReminder();
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to record video.");
    } finally {
      setIsRecording(false);
    }
  };

  const handleAction = () => {
    if (cameraMode === "picture") handleTakePhoto();
    else handleRecord();
  };

  return (
    <View className="flex-1 bg-black">
      <StyledCameraView
        ref={cameraViewRef}
        onCameraReady={() => setCameraReady(true)}
        className="flex-1 w-full"
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "code128"],
        }}
        onBarcodeScanned={handleScan}
        mode={cameraMode}
        autofocus="on"
        videoQuality="2160p"
      />
      <FlipCameraButton
        disabled={isRecording}
        toggleCameraFacing={toggleCameraFacing}
      />

      {isRecording && (
        <View className="absolute top-16 items-center left-0 right-0 px-4 py-3">
          <Text className="font-semibold text-white">
            📹 {recordMinutes.toString().padStart(2, "0")}:
            {recordSeconds.toString().padStart(2, "0")}
          </Text>
        </View>
      )}

      <CameraModeSwitchBar
        cameraMode={cameraMode}
        cameraBtnList={cameraBtnList}
        disabled={isRecording}
      />

      <View className="absolute bottom-16 w-full items-center">
        <TouchableOpacity
          className="items-center justify-center border-4 border-white bg-black/50 size-20 p-1 rounded-full disabled:opacity-50"
          disabled={isCameraDisabled}
          onPress={handleAction}
        >
          {cameraMode === "picture" ? (
            <View className="w-full h-full items-center justify-center bg-white rounded-full">
              <Host matchContents>
                <Icon
                  name={Icon.select({
                    ios: "camera.fill",
                    android: import("@expo/material-symbols/photo_camera.xml"),
                  })}
                  size={32}
                  color="black"
                />
              </Host>
            </View>
          ) : (
            <View
              className={`bg-red-500 ${isRecording ? "size-8 rounded-lg" : "size-full rounded-full"}`}
            ></View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
