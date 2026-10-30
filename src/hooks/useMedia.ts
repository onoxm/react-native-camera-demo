import { Asset } from "expo-media-library";

export const useMedia = () => {
  const addMediaToGallery = async (uri: string) => {
    try {
      const asset = await Asset.create(uri);
      return asset;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const deleteMediaFromGallery = async (id: string) => {
    try {
      const asset = new Asset(id);
      await asset.delete();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  return { addMediaToGallery, deleteMediaFromGallery };
};
