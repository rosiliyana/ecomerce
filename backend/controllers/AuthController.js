const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET;

//Generate JWT Token
const generateToken = (id) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

//Sign In (Login)
exports.signUp = async (req, res) => {
    console.log('req', req.body)
    const { email,password, role} =  req.body;

    try{
        //Cek apakah pengguna terdaftar
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah digunakan!' });         
        }

        const newUser = await User.create({
            name: email,
            email,
            password: password,
            role: "User" // Default role "user"
        });

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: generateToken, // Opsional untuk autentikasi
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}

exports.signIn = async (req, res) => {
    console.log("req", req.body);
    const { email, password, role } = req.body;

    try {
        // Cek apakah pengguna terdaftar
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User tidak terdaftar!" });
        }

        // Cek apakah password cocok (langsung perbandingan string)
        if (password !== user.password) {
            return res.status(401).json({ message: "Email atau password salah!" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            token: generateToken,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}