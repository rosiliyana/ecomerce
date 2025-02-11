import { useState } from "react";
import { Input, Button, Form, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL_SIGNIN } from "../utils/Endpoint";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (values) => {
        setLoading(true);
        const data = {
            email: values.email,
            password: values.password,
        };
        axios
            .post(URL_SIGNIN, data)
            .then((res) => {
                console.log("res", res);
                if (res.data.role !== "Admin") {
                    setErrMsg("Anda tidak memiliki akses ke dalam dashboard admin");
                } else {
                    navigate("/dashboard");
                }
                setLoading(false);
            })
            .catch((err) => {
                setErrMsg(err.response.data.message);
                setLoading(false);
            });

        axios
            .post(URL_SIGNIN, data)
            .then((res) => {
                console.log("res", res);
                if (res.data.role !== "User") {
                    setErrMsg("Anda tidak memiliki akses ke dalam halaman utama");
                } else {
                    navigate("/");
                }
                setLoading(false);
            })
            .catch((err) => {
                setErrMsg(err.response.data.message);
                setLoading(false);
            });
    };

    return (
        <>
            {errMsg !== "" && (
                <div className="p-5">
                    <Alert message={errMsg} type="error" />
                </div>
            )}
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-300 to-orange-500">
                <div className="bg-orange-100 p-8 rounded-2xl shadow-lg w-full max-w-sm">
                    <h2 className="text-center text-xl font-bold text-orange-700 mb-6">LOGIN</h2>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Username"
                            name="email"
                            rules={[{ required: true, message: "Please input your username!" }]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="Username"
                                size="large"
                                className="rounded-md"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please input your password!" }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Password"
                                size="large"
                                className="rounded-md"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="orange"
                                htmlType="submit"
                                block
                                loading={loading}
                                size="large"
                                className="bg-orange-600 hover:bg-orange-700 text-white rounded-md shadow-md"
                            >
                                LOGIN
                            </Button>
                        </Form.Item>
                        <div className="text-center text-sm text-gray-600">
                            Belum punya akun?{" "}
                            <a href="/CreateAccount" className="text-orange-600 hover:text-orange-800">
                                Daftar
                            </a>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default Login;