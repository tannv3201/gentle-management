import React, { useState } from "react";
import axios from "axios";
import { importExcelProduct } from "../../redux/api/importExcel";

function ImportExcel() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await importExcelProduct();
    };

    return (
        <div>
            <h1>Import dữ liệu từ Excel</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
        </div>
    );
}

export default ImportExcel;
