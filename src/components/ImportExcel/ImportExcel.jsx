import React, { useEffect } from "react";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { importExcelProduct } from "../../redux/api/importExcel";
import GModal from "../GModal/GModal";
import { Grid } from "@mui/material";
import { toast } from "react-hot-toast";
import GButton from "../MyButton/MyButton";

export default function CreateUpdateProductModal({
    handleOpen,
    isOpen,
    title,
    handleFileChange,
    handleUpload,
    ...props
}) {
    const user = useSelector((state) => state.auth.login?.currentUser);

    const handleCloseModal = () => {
        props.handleClose();
    };

    return (
        <>
            <GModal
                handleClose={handleCloseModal}
                handleOpen={handleOpen}
                isOpen={isOpen}
                title={title}
            >
                <div style={{ marginTop: "12px", minWidth: 500 }}>
                    <input type="file" onChange={handleFileChange} />
                    <div style={{ marginTop: "12px" }}>
                        <GButton
                            color={"success"}
                            size="small"
                            onClick={handleUpload}
                        >
                            Upload
                        </GButton>

                        <GButton
                            style={{ marginLeft: "12px" }}
                            color={"error"}
                            onClick={props?.handleClose}
                        >
                            Hủy
                        </GButton>
                    </div>
                </div>
            </GModal>
        </>
    );
}
