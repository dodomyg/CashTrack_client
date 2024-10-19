import { DownloadIcon } from "lucide-react";
import { CSVLink } from "react-csv";
import { Button } from "./ui/button";

// eslint-disable-next-line react/prop-types
const ExportButton = ({ filename, data }) => {
  return (
    <div>
      <CSVLink data={data} filename={`${filename}_${Date.now()}`}>
        <Button leftSection={<DownloadIcon size="1.1rem" />}>Export</Button>
      </CSVLink>
    </div>
  );
};

export default ExportButton;
