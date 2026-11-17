import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/** Image picker results live in a cache folder the OS can clear, so copy them somewhere permanent. */
async function keep(uri: string): Promise<string> {
  const dir = new Directory(Paths.document, 'photos');
  if (!dir.exists) dir.create({ idempotent: true, intermediates: true });
  const source = new File(uri);
  const ext = source.extension || '.jpg';
  const dest = new File(dir, `${Date.now()}${ext}`);
  await source.copy(dest);
  return dest.uri;
}

/**
 * Lets the user take or choose a photo. `crop` shows the 4:3 crop step, which suits meal
 * photos but gets in the way of photographing a whole recipe card.
 */
export async function pickPhoto(fromCamera: boolean, { crop = true } = {}): Promise<string | undefined> {
  if (fromCamera) {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera access needed', 'Allow camera access in Settings to snap photos.');
      return;
    }
  }
  const options: ImagePicker.ImagePickerOptions = {
    allowsEditing: crop,
    aspect: [4, 3],
    quality: 0.6,
    // Ask iOS for JPEG instead of HEIC, which Claude can't read.
    preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
  };
  const result = fromCamera
    ? await ImagePicker.launchCameraAsync(options)
    : await ImagePicker.launchImageLibraryAsync({ ...options, mediaTypes: ['images'] });
  if (result.canceled) return;
  return keep(result.assets[0].uri);
}

export type PhotoData = { data: string; mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' };

const MEDIA_TYPES: Record<string, PhotoData['mediaType']> = {
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

/** Reads a saved photo as base64 so it can be sent to Claude. */
export async function readPhoto(uri: string): Promise<PhotoData> {
  const file = new File(uri);
  return { data: await file.base64(), mediaType: MEDIA_TYPES[file.extension.toLowerCase()] ?? 'image/jpeg' };
}

export function deletePhoto(uri: string) {
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Photo already gone; nothing to clean up.
  }
}
