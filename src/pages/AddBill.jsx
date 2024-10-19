import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";

const AddBill = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 shadow-lg rounded-xl">
      <CardHeader>
        <h2 className="text-center text-2xl font-semibold mb-4">
          Upload Your Bill
        </h2>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className="border-4 border-dashed border-blue-500 rounded-lg p-12 text-center bg-blue-50 hover:bg-blue-100 cursor-pointer transition-all"
        >
          <input {...getInputProps()} />
          <p className="text-gray-700 text-xl">
            Drag and drop images here or click to browse
          </p>
        </div>
        <Button className="mt-6 w-full text-lg bg-blue-500 text-white hover:bg-blue-600">
          Browse Images
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddBill;
