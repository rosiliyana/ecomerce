import React, { useEffect, useState } from "react";
import {
    Card,
    Button,
    Input,
    Form,
    Col,
    Row,
    Divider,
    message,
    Select,
} from "antd";
import {
    ShoppingCartOutlined,
    CreditCardOutlined,
    HomeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { URL_PRODUCT, URL_TRANSACTION } from "../utils/Endpoint";
import { useNavigate, useParams, Link } from "react-router-dom";
import Footer from './Footer';

const { Option } = Select;

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState("");
    const [midtransUrl, setMidtransUrl] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [form] = Form.useForm();
    const params = useParams();
    const { id } = params;
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${URL_PRODUCT}/${id}`)
            .then((res) => {
                setProduct(res.data);
                setMidtransUrl(res.data.midtrans_url);
                setTotalPrice(res.data.price);
            })
            .catch((err) => {
                console.log("err", err.response);
            });
    }, [id]);

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
        setTotalPrice((quantity + 1) * product.price);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setTotalPrice((quantity - 1) * product.price);
        }
    };

    const handleCheckout = (values) => {
        setLoading(true);
        const data = {
            first_name: values.first_name,
            amount: totalPrice,
        };
        axios
            .post(URL_TRANSACTION, data)
            .then((res) => {
                if (res.data.midtrans_url) {
                    window.location.href = res.data.midtrans_url;
                }
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-orange-200 to-orange-500">
            <div className="w-[400px] bg-orange-100 rounded-2xl p-8 shadow-lg">
                <div className="bg-orange-200 p-4 rounded-xl flex flex-col items-center">
                    <div className="flex gap-9 items-center justify-center">
                        <div className="mt-3 flex flex-col items-center">
                            <img alt={product.name} src={product.thumbnail} className="w-28 h-28 object-cover rounded-md mb-2" />
                            <h3 className="text-lg font-semibold text-orange-700">{product?.name}</h3>
                        </div>
                        <div>
                            <div className="flex items-center ">
                                <Button type='orange' onClick={decreaseQuantity} className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-full" icon="-" />
                                <span className="px-4 text-lg font-semibold text-orange-700">{quantity}x</span>
                                <Button type='orange' onClick={increaseQuantity} className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-full" icon="+" />
                            </div>
                            <p className="font-semibold mt-4 bg-orange-600 text-white py-1 px-4 rounded-full shadow-md">
                                Rp {totalPrice.toLocaleString("id-ID")}     
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 text-center">
                        <p className="text-lg font-semibold text-orange-700">TOTAL : Rp {totalPrice.toLocaleString("id-ID")}</p>
                        <div className="mt-4 flex justify-between">
                            <Form form={form} layout='vertical' onFinish={handleCheckout} initialValues={{ paymentMethod: "credit-card" }}>
                                <Form.Item name="first_name" rules={[{ required: true, message: "Silahkan masukkan nama kamu!" }]}>
                                    <Input placeholder="Masukkan nama kamu" />
                                </Form.Item>
                                <Form.Item>
                                    <div className="space-x-4">
                                        <button onClick={() => navigate(-1)} className="text-white font-medium bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-full shadow-md">Kembali</button>
                                        <button type='orange' htmlType='submit' block loading={loading} className=" text-white font-medium bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-full shadow-md">Checkout</button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
