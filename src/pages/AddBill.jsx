import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { storage } from "@/lib/firebase";
import toast from "react-hot-toast";
axios.defaults.withCredentials = true;

const AddBill = () => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      uploadImageToFirebase(acceptedFiles[0]);
    },
    multiple: false,
    maxFiles: 1,
  });

  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImageToFirebase = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const storageRef = storage.ref(`images/${user.id}/${file.name}`);
      const snapshot = await storageRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();
      toast.success("File uploaded successfully");
      console.log("File uploaded to Firebase successfully:", downloadURL);
    } catch (error) {
      console.error("Error uploading file to Firebase:", error);
    }

    try {
      const resp = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        {
          withCredentials: true,
        }
      );
      if (resp.status === 200) {
        toast.success("Generating");
        console.log("File uploaded to flask backend:", resp.data);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <Card className="w-full max-w-2xl mx-auto p-8 shadow-lg rounded-xl">
    //   <CardHeader>
    //     <h2 className="text-center text-2xl font-semibold mb-4">
    //       Upload Your Bill
    //     </h2>
    //   </CardHeader>
    //   <CardContent>
    //     <div
    //       {...getRootProps()}
    //       className="border-4 border-dashed border-blue-500 rounded-lg p-12 text-center bg-blue-50 hover:bg-blue-100 cursor-pointer transition-all"
    //     >
    //       <input {...getInputProps()} />
    //       {isDragActive ? (
    //         <h2 className="text-xl text-blue-700">Drop the files here...</h2>
    //       ) : (
    //         <h2 className="text-xl text-gray-700">
    //           Drag and drop images here, or click to browse
    //         </h2>
    //       )}
    //     </div>
    //     <Button className="mt-6 w-full text-lg bg-blue-500 text-white hover:bg-blue-600">
    //       Browse Images
    //     </Button>
    //   </CardContent>
    // </Card>

    <div>
      <form
        onSubmit={uploadImageToFirebase}
        className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-md"
        encType="multipart/form-data"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {file && (
            <img
              className="w-full rounded-lg object-cover"
              src={URL.createObjectURL(file)}
              alt="Uploaded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full mt-2 hover:bg-blue-600 transition-colors"
          >
            Upload Image
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBill;
