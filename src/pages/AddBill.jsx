import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { db, storage } from "@/lib/firebase";
import toast from "react-hot-toast";
import Loader from "@/context/Loader";
axios.defaults.withCredentials = true;

const AddBill = () => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [id, setId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const [categorizing, setCategoring] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && file.type.startsWith("image/")) {
        setFile(file);
      } else {
        toast.error("Please upload a valid image file.");
      }
    },
    multiple: false,
    maxFiles: 1,
  });

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFile(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const uploadImageToFirebase = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("No file selected");
      return;
    }

    let downloadURL;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const storageRef = storage.ref(`images/${user.id}/${file.name}`);
      const snapshot = await storageRef.put(file);
      downloadURL = await snapshot.ref.getDownloadURL();
      toast.success("File uploaded successfully");
      console.log("File uploaded to Firebase successfully:", downloadURL);
    } catch (error) {
      console.error("Error uploading file to Firebase:", error);
      toast.error("Error uploading file");
      setUploading(false);
      return; // Exit if image upload fails
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        let items = [];
        response.data?.data?.menu?.forEach((element) => {
          items.push(element.nm);
        });
        console.log("File uploaded to Flask backend:", response.data.data);
        await db
          .collection("bills")
          .doc(id)
          .set({
            userId: user?.id,
            id: id,
            total_price: parseInt(response?.data?.data?.total?.total_price),
            items: items,
            imgUrl: downloadURL || "",
            date: new Date(),
          });

        toast.success("Bill uploaded successfully");
        items = [];
        setUploading(false);
        setFile(null);
        setId(uuidv4());
        setLoading(false);
      } else {
        toast.error("Something went wrong while uploading to backend");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error uploading to backend:", error);
      toast.error("Error uploading to backend");
      setLoading(false);
    }

    // setCategoring(true);
    try {
      const categoryResp = await axios.post(
        `http://localhost:5000/category/${id}`
      );
      console.log(categoryResp.data);
      // setCategoring(false);
      // await db.collection("bill").doc(id).update()
    } catch (error) {
      console.log(error);
      // setCategoring(false);
    }
  };

  return loading ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Loader />
      <h1 className="mt-4 text-lg font-semibold text-gray-600">
        Processing your bill details...
      </h1>
    </div>
  ) : (
    <div className="container mx-auto p-8 flex flex-col items-center bg-gray-100">
      <form
        onSubmit={uploadImageToFirebase}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg"
        encType="multipart/form-data"
      >
        <CardHeader>
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Upload Your Bill
          </h2>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-lg font-medium text-gray-600">
                Drop the file here...
              </p>
            ) : (
              <p className="text-lg font-medium text-gray-600">
                Drag and drop an image here, or click to select a file
              </p>
            )}
          </div>
          {file && (
            <img
              className="w-full h-48 object-cover rounded-lg mb-4"
              src={URL.createObjectURL(file)}
              alt="Uploaded preview"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-gray-100 file:text-blue-700
                         hover:file:bg-blue-100 focus:outline-none"
          />
          <Button
            type="submit"
            disabled={uploading}
            className={`mt-6 w-full py-2 text-lg font-semibold text-white rounded-lg transition-colors ${
              uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </CardContent>
      </form>
    </div>
  );
};

export default AddBill;
