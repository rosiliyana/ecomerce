import { useState } from "react";
import { Input, Button, Form, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL_SIGNUP } from "../utils/Endpoint"; 
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (values) => {  
        setLoading(true);
        setErrMsg("");
        setSuccessMsg("");

        if (values.password !== values.confirmPassword) {
            setErrMsg("Password dan konfirmasi password tidak cocok!");
            setLoading(false);
            return;
        }

        const data = {
            email: values.email,
            password: values.password,
            
        };

    axios
    .post(URL_SIGNUP, data)
    .then((res) => {
        console.log(res); // Cek apakah response dari server ada
        setSuccessMsg("Akun berhasil dibuat! Silahkan login.");
        form.resetFields();
        setTimeout(() => navigate("/signin"), 2000);
    })
    .catch((err) => {
        console.error(err);  // Cek jika ada error
        setErrMsg(err.response?.data?.message || "Terjadi kesalahan!");
    })
    .finally(() => {
        setLoading(false);
    });


    };

    return (
        <>
            {errMsg && <Alert message={errMsg} type="error" showIcon className="mb-4" />}
            {successMsg && <Alert message={successMsg} type="success" showIcon className="mb-4" />}

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-300 to-orange-500">
                <div className="bg-orange-100 p-8 rounded-2xl shadow-lg w-full max-w-sm">
                    <h2 className="text-center text-xl font-bold text-orange-700 mb-6">
                        CREATE ACCOUNT
                    </h2>

                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        {/* Username */}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Masukkan email!" }]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="Username"
                                size="large"
                                className="rounded-md"
                            />
                        </Form.Item>

                        {/* Password */}
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Masukkan password!" }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Password"
                                size="large"
                                className="rounded-md"
                            />
                        </Form.Item>

                        {/* Konfirmasi Password */}
                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            rules={[{ required: true, message: "Konfirmasi password!" }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Konfirmasi Password"
                                size="large"
                                className="rounded-md"
                            />
                        </Form.Item>

                        {/* Submit Button */}
                        <Form.Item>
                            <Button
                                type="orange"
                                htmlType="submit"
                                block
                                loading={loading}
                                size="large"
                                className="bg-orange-600 hover:bg-orange-700 text-white rounded-md shadow-md"
                            >
                                CREATE
                            </Button>
                        </Form.Item>

                        {/* Link ke Login */}
                        <div className="text-center text-sm text-gray-600">
                            Sudah punya akun?{" "}
                            <a href="/signin" className="text-orange-600 hover:text-orange-800">
                                Login
                            </a>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default CreateAccount;