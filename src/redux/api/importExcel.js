import axios from "axios";
import { toast } from "react-hot-toast";
import { getAllProduct } from "./apiProduct";

export const importExcelProduct = async (
    accessToken,
    formData,
    dispatch,
    axiosJWT
) => {
    try {
        const res = await axios.post("v1/excel/importExcel/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                token: `Bearer ${accessToken}`,
            },
        });

        if (res?.data?.status === 200) {
            toast.error("Nhập excel thành công");
            await getAllProduct(accessToken, dispatch, axiosJWT);
        } else {
            toast.error("Có lỗi xảy ra!");
        }
        return res?.data;
    } catch (error) {
        console.log(error);
        toast.error("Có lỗi xảy ra!");
    }
};
