import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL_PRODUCT } from "../../utils/Endpoint"; // Ganti dengan URL backend Anda
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch product data on mount
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${URL_PRODUCT}/${id}`);
                setProduct(res.data);

                // Set form values
                form.setFieldsValue({
                    name: res.data.name,
                    price: res.data.price,
                });

                // Set initial file list if thumbnail exists
                if (res.data.thumbnail) {
                    setFileList([
                        {
                            uid: "-1",
                            name: "thumbnail.png",
                            status: "done",
                            url: res.data.thumbnail,
                        },
                    ]);
                }
            } catch (err) {
                message.error("Failed to fetch product data");
            }
        };

        fetchProduct();
    }, [form, id]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            const data = new FormData();
            data.append("name", values.name);
            data.append("price", values.price);

            // Append new thumbnail if uploaded
            if (fileList.length > 0 && fileList[0]?.originFileObj) {
                data.append("thumbnail", fileList[0].originFileObj);
            }

            // Update product
            await axios.patch(`${URL_PRODUCT}/${id}`, data);
            message.success("Product updated successfully");
            navigate("/dashboard/products");
        } catch (error) {
            message.error("Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    // Handle file upload changes
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    return (
        <div>
            <button onClick={() => navigate(-1)} className="text-white font-medium bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700">Kembali</button>
            <h1>Edit Product</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: "Please input product name!" }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: "Please input price!" }]}
                >
                    <Input type="number" placeholder="Enter product price" />
                </Form.Item>

                <p>
                    Current Thumbnail:{" "}
                    {product?.thumbnail ? (
                        <a href={product.thumbnail} target="_blank" rel="noopener noreferrer">
                            View Thumbnail
                        </a>
                    ) : (
                        "No thumbnail available"
                    )}
                </p>

                <Form.Item
                    name="thumbnail"
                    label="Thumbnail"
                    valuePropName="fileList"
                    getValueFromEvent={({ fileList }) => fileList}
                >
                    <Upload
                        listType="picture"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={() => false}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update Product
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateProduct;
