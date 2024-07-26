const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pengguna } = require("../models");
require("dotenv").config();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { nama_pengguna, kata_sandi, peran_pengguna } = req.body;
    const hashedPassword = await bcrypt.hash(kata_sandi, 10);
    const pengguna = await Pengguna.create({
      nama_pengguna,
      kata_sandi: hashedPassword,
      peran_pengguna,
    });
    res.status(201).json(pengguna);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { nama_pengguna, kata_sandi } = req.body;
    const pengguna = await Pengguna.findOne({ where: { nama_pengguna } });

    if (!pengguna) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(kata_sandi, pengguna.kata_sandi);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      {
        id_pengguna: pengguna.id_pengguna,
        peran_pengguna: pengguna.peran_pengguna,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
