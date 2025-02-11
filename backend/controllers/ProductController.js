const Product = require("../models/Product");
const cloudinary =  require("../config/cloudinary");

// Mendapatkan semua product
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
 
exports.getDetailProduct = async (req, res) => {
    try {
        const  { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product ot found "});
        }

        // Return the found product as a response
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error "});
    }
};

// Menambahkan product baru
exports.createProduct = async (req, res) => {
    try {
        // Mengunggah file ke Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        // console.log('result', result)

        // Membuat product dengan data dari body dan menambahkan thumbnail URL
        const product = new Product({
            ...req.body,
            thumbnail: result?.secure_url,
            cloudinaryId: result?.public_id,
        });

        // Menyimpan produk ke database
        await product.save();

        // const product = new Product(req.body);
        // await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
     
        const product = await Product.findById(req.params.id);

     
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

      
        if (product.cloudinaryId) {
            await cloudinary.uploader.destroy(product.cloudinaryId);
        }

      
        await product.deleteOne();

        // Kirim respons sukses
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete product" });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID dari parameter URL

        // Validasi ID MongoDB
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Cari produk berdasarkan ID
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log("req.file", req.file);

        let result;
        if (req.file) {
            // Hapus gambar lama dari Cloudinary
            if (product.cloudinaryId) {
                await cloudinary.uploader.destroy(product.cloudinaryId);
            }

            // Unggah gambar baru ke Cloudinary
            result = await cloudinary.uploader.upload(req.file.path);
        }

        // Data pembaruan produk
        const updatedProduct = {
            ...req.body, // Data lain dari request body
            thumbnail: result?.secure_url || product.thumbnail, // Gambar baru atau tetap yang lama
            cloudinaryId: result?.public_id || product.cloudinaryId, // ID gambar baru atau tetap yang lama
        };

        // Simpan pembaruan ke database
        product = await Product.findByIdAndUpdate(id, updatedProduct, { new: true });

        // Kirim response
        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update product", error: err.message });
    }
};


