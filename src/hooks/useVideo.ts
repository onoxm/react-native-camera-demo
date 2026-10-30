import { useMicrophonePermissions } from "expo-camera";
import { useEffect, useState } from "react";

export const useVideo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const [recordTime, setRecordTime] = useState(0);

  const recordMinutes = Math.floor(recordTime / 60);
  const recordSeconds = recordTime % 60;

  useEffect(() => {
    setRecordTime(0);
    let timer = null;

    if (isRecording) {
      timer = setInterval(() => {
        setRecordTime((current) => current + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRecording]);

  return {
    isRecording,
    setIsRecording,
    microphonePermission,
    requestMicrophonePermission,
    recordTime,
    setRecordTime,
    recordMinutes,
    recordSeconds,
  };
};
