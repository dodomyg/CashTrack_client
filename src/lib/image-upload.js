import { storage } from "./firebase";

async function uploadImage(file, imagePath) {
  const storageRef = storage.ref();
  const imageRef = storageRef.child(imagePath);
  try {
    const snapshot = await imageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);

    throw error;
  }
}

async function deleteImage(imagePath) {
  const storageRef = storage.ref();
  const imageRef = storageRef.child(imagePath);
  try {
    await imageRef.delete();
  } catch (error) {
    console.error("Error deleting image from Firebase Storage:", error);

    throw error;
  }
}

export { uploadImage, deleteImage };
