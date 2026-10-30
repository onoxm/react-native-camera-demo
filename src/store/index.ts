import { Media } from "@/types/media";
import { defineGlobalState } from "@onoxm/react-tools";

const globalState = {
  medias: [] as Media[],
  checkMediaReminder: true,
};

const useStore = defineGlobalState(globalState);

export { useStore };
