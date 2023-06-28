import { toast } from "react-hot-toast";
import ImportExcel from "../../../components/ImportExcel/ImportExcel";
import { importExcelProduct } from "../../../redux/api/importExcel";
import { useSelector } from "react-redux";
import { useState } from "react";
import { createAxios } from "../../../createInstance";
import { loginSuccess } from "../../../redux/slice/authSlice";
import { useDispatch } from "react-redux";

function ImportExcelProduct({ isOpen, handleOpen, handleClose, title }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Vui lòng chọn File Excel");
        } else {
            const formData = new FormData();
            formData.append("file", selectedFile);
            await importExcelProduct(
                user?.accessToken,
                formData,
                dispatch,
                axiosJWT
            ).then(() => handleClose());
        }
    };

    return (
        <>
            <ImportExcel
                title={title}
                isOpen={isOpen}
                handleOpen={handleOpen}
                handleClose={handleClose}
                handleFileChange={handleFileChange}
                handleUpload={handleUpload}
            />
        </>
    );
}

export default ImportExcelProduct;
