import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button, Typography, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL_PRODUCT } from "../utils/Endpoint";
import { Link } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Footer from './Footer';

const { Title } = Typography;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get(URL_PRODUCT)
      .then((res) => {
        console.log("res", res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
        message.error("Failed to fetch products");
      });
  }, []);

  // Filter produk berdasarkan pencarian
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-200 to-orange-400">
      <header className="flex justify-between items-center py-4 px-6 bg-amber-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <img src="./src/assets/NF.png" />
          </div>
          <h1 className="ml-4 text-2xl font-bold text-white">Nebula Fitwaves</h1>
        </div>
        <div className="flex gap-4">
          <Link to={`/signin`}>
            <button className="text-white font-medium">Login Akun</button>
          </Link>
        </div>
      </header>

      <main className="flex-grow mt-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">The Homemade Risol Mayo</h2>
          <div className="size-24 mx-auto my-4">
            <img src="./src/assets/RisolMayo.png" alt="Risol Mayo Logo" className="size-full object-contain border-4 border-amber-700 rounded-full" />
          </div>
          
          {/* Input Pencarian */}
          <div className="mt-8 relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Cari menu"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery setiap kali ada input
              className="w-full py-2 pl-10 pr-4 rounded-full shadow focus:outline-none"
            />
            <span className="absolute top-3 left-3 text-black">
              <FaMagnifyingGlass />
            </span>
          </div>
        </div>

        {/* Produk */}
        <div className="mt-10 ml-12 px-16">
          <Row gutter={[16, 16]} justify="center" className="grid grid-cols-3 gap-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Col key={product.id} className="p-2">
                  <Card
                    hoverable
                    className="w-full max-w-xs bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="overflow-hidden rounded-lg">
                      <img alt={product.name} src={product.thumbnail} className="w-full h-48 object-cover rounded-lg" />
                    </div>
                    <div className="p-4 mt-2">
                      <Card.Meta
                        title={<span className="text-lg font-semibold text-orange-600">{product.name}</span>}
                        description={<span className="font-medium text-gray-700 text-sm">{`Rp. ${product.price}`}</span>}
                      />
                      <Button
                        className="mt-3 flex items-start text-center justify-start gap-1 w-2/4 py-1 bg-orange-600 text-white rounded-full hover:bg-orange-700"
                        type="orange"
                        icon={<ShoppingCartOutlined />}
                      >
                        <Link to={`/checkout/${product._id}`}>Checkout</Link>
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="mt-10 mr-10 text-center text-2xl font-bold text-white col-span-3">Produk tidak ditemukan!</p>
            )}
          </Row>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
