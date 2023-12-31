import React from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllProduct } from "../../../redux/api/apiProduct";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../../redux/slice/authSlice";
import { createAxios } from "../../../createInstance";
import { useState } from "react";
import GTable from "../../../components/GTable/GTable";
import { IconButton } from "@mui/material";
import GButton from "../../../components/MyButton/MyButton";

import { LightTooltip } from "../../../components/GTooltip/GTooltip";
import CreateUpdateProductModal from "./CreateUpdateProductModal";

import DeleteProductPopup from "./DeleteProductPopup";
import { API_IMAGE_URL } from "../../../LocalConstants";
import styles from "./Product.module.scss";
import classNames from "classnames/bind";
import { InfoRounded } from "@mui/icons-material";
import FilterProduct from "./FilterProduct/FilterProduct";
import { FormatCurrency } from "../../../utils/FormatCurrency/formatCurrency";
import { importExcelProduct } from "../../../redux/api/importExcel";
import ImportExcelProduct from "./ImportExcelProduct";

const cx = classNames.bind(styles);

export default function ProductList() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [cloneData, setCloneData] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState({});

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const productList = useSelector(
        (state) => state.product.product?.productList
    );

    useEffect(() => {
        if (!user) {
            navigate("/dang-nhap");
        }
        if (user?.accessToken && productList?.length === 0) {
            getAllProduct(user?.accessToken, dispatch, axiosJWT);
        }
    }, []);

    const productListSearch = useSelector(
        (state) => state.product.product?.productListSearch
    );

    const location = useLocation();
    useEffect(() => {
        if (location.search) {
            setCloneData(structuredClone(productListSearch));
        } else if (!location.search) {
            setCloneData(structuredClone(productList));
        }
    }, [productList, productListSearch, isFiltering]);

    // Create update modal
    const [isOpenCreateUpdateModel, setIsOpenCreateUpdateModel] =
        useState(false);

    const handleOpenCreateUpdateModal = (rowData) => {
        setIsOpenCreateUpdateModel(true);
    };

    const handleCloseCreateUpdateModal = () => {
        setIsOpenCreateUpdateModel(false);
    };

    // Delete confirm modal
    const [isOpenDeleteConfirmPopup, setIsOpenDeleteConfirmPopup] =
        useState(false);

    const handleOpenDeleteConfirmPopup = (rowData) => {
        setSelectedProduct({
            id: rowData.id,
            name: rowData.name,
            description: rowData.description,
        });
        setIsOpenDeleteConfirmPopup(true);
    };

    const handleCloseDeleteConfirmPopup = () => {
        setIsOpenDeleteConfirmPopup(false);
    };

    const handleNavigateProductDetail = (productId) => {
        navigate(`/product/${productId}`);
    };

    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const [isOpenImportExcelModal, setIsOpenImportExcelModal] = useState(false);

    const handleOpenImportExcelModal = () => {
        setIsOpenImportExcelModal(true);
    };

    const handleCloseImportExcelModal = () => {
        setIsOpenImportExcelModal(false);
    };
    return (
        <>
            <div>
                {user?.role_id <= 2 && (
                    <>
                        <GButton
                            style={{ marginRight: 12 }}
                            onClick={handleOpenCreateUpdateModal}
                        >
                            Thêm sản phẩm
                        </GButton>

                        {/* <GButton
                            style={{ marginRight: 12 }}
                            onClick={handleOpenImportExcelModal}
                        >
                            Nhập Excel
                        </GButton> */}
                    </>
                )}
                <FilterProduct
                    isFiltering={isFiltering}
                    setIsFiltering={setIsFiltering}
                />
            </div>
            <br />
            <GTable
                title={"DANH SÁCH SẢN PHẨM"}
                columns={[
                    {
                        title: "Hình ảnh",
                        field: "image_url",
                        export: false,
                        render: (rowData) => (
                            // eslint-disable-next-line jsx-a11y/alt-text
                            <img
                                src={
                                    rowData?.image_url
                                        ? `${API_IMAGE_URL}/${rowData?.image_url}`
                                        : ""
                                }
                                style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                }}
                            />
                        ),
                    },
                    { title: "Tên sản phẩm", field: "name" },
                    { title: "Số lượng", field: "quantity" },
                    {
                        title: "Giá",
                        field: "price",
                        render: (rowData) => {
                            if (rowData?.discount_id) {
                                return (
                                    <div className={cx("product-price")}>
                                        <span
                                            className={cx(
                                                "product-default-price"
                                            )}
                                        >
                                            {FormatCurrency(rowData?.price)}
                                        </span>
                                        <span
                                            className={cx(
                                                "product-onsale-price"
                                            )}
                                        >
                                            {FormatCurrency(
                                                rowData?.price_onsale
                                            )}
                                        </span>
                                        <span className={cx("onsale-label")}>
                                            SALE
                                        </span>
                                    </div>
                                );
                            } else {
                                return FormatCurrency(rowData?.price);
                            }
                        },
                    },
                    {
                        title: "Mô tả",
                        field: "description",
                        render: (rowData) => {
                            return (
                                <>
                                    <div className={cx("product-description")}>
                                        {rowData.description}
                                    </div>
                                </>
                            );
                        },
                    },
                    {
                        title: "Thao tác",
                        field: "actions",
                        sorting: false,
                        export: false,
                        render: (rowData) => (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <LightTooltip
                                    placement="bottom"
                                    title="Chi tiết"
                                >
                                    <IconButton
                                        onClick={() => {
                                            handleNavigateProductDetail(
                                                rowData?.id
                                            );
                                        }}
                                    >
                                        <InfoRounded color="primary" />
                                    </IconButton>
                                </LightTooltip>
                                {user?.role_id === 1 && (
                                    <LightTooltip
                                        placement="bottom"
                                        title="Xóa"
                                    >
                                        <IconButton
                                            onClick={() => {
                                                handleOpenDeleteConfirmPopup(
                                                    rowData
                                                );
                                            }}
                                        >
                                            <DeleteRoundedIcon color="error" />
                                        </IconButton>
                                    </LightTooltip>
                                )}
                            </div>
                        ),
                    },
                ]}
                data={cloneData || []}
                exportFileName={"DanhSachNguoiDung"}
            />

            <CreateUpdateProductModal
                isOpen={isOpenCreateUpdateModel}
                handleOpen={handleOpenCreateUpdateModal}
                handleClose={handleCloseCreateUpdateModal}
            />

            <DeleteProductPopup
                isOpen={isOpenDeleteConfirmPopup}
                handleOpen={handleOpenDeleteConfirmPopup}
                handleClose={handleCloseDeleteConfirmPopup}
                selectedProduct={selectedProduct}
            />

            {/* <ImportExcelProduct
                isOpen={isOpenImportExcelModal}
                handleClose={handleCloseImportExcelModal}
                handleOpen={handleOpenImportExcelModal}
                title={"Import danh sách sản phẩm"}
            /> */}
        </>
    );
}
