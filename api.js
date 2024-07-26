const express = require("express");
const router = express.Router();
const {
  Pengguna,
  PiutangPelanggan,
  PembayaranPiutang,
  Proyek,
  BiayaProyek,
} = require("../models");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Middleware for authentication and authorization
router.use(authenticateToken);

/* 
  Kode ini mengonfigurasi router Express untuk menangani rute yang berkaitan dengan entitas PiutangPelanggan, PembayaranPiutang, Proyek, dan BiayaProyek. 
  Middleware authenticateToken digunakan untuk memastikan setiap permintaan telah diautentikasi dengan token JWT. 
  Untuk setiap entitas, 
  terdapat rute-rute untuk operasi CRUD: mengambil data (GET), 
  menambahkan data baru (POST), 
  memperbarui data berdasarkan ID (PUT), 
  dan menghapus data berdasarkan ID (DELETE). 
  Hanya pengguna dengan peran "petugas_keuangan" yang diizinkan mengakses rute-rute ini melalui middleware authorizeRole. 
  Jika operasi berhasil, data dikembalikan dalam format JSON; 
  jika terjadi kesalahan, respons dengan status 500 dan pesan kesalahan dikirimkan. 
  Middleware authorizeRole memastikan bahwa hanya pengguna dengan peran yang sesuai yang dapat melakukan perubahan pada data.
*/

// Routes for Piutang Pelanggan
router.get(
  "/piutang-pelanggan",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      const piutangs = await PiutangPelanggan.findAll();
      res.json(piutangs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/piutang-pelanggan",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      const piutang = await PiutangPelanggan.create(req.body);
      res.status(201).json(piutang);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/piutang-pelanggan/:id",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      const [updated] = await PiutangPelanggan.update(req.body, {
        where: { id_piutang_pelanggan: req.params.id },
        returning: true, // Ensure the update method returns the updated records
      });

      if (updated === 0) {
        return res.status(404).json({ error: "PiutangPelanggan not found" });
      }

      // Fetch the updated record
      const updatedPiutang = await PiutangPelanggan.findByPk(req.params.id);

      res.json(updatedPiutang);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/piutang-pelanggan/:id",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      // Check if the record exists
      const piutang = await PiutangPelanggan.findByPk(req.params.id);

      if (!piutang) {
        return res.status(404).json({ error: "PiutangPelanggan not found" });
      }

      // Delete the record
      await PiutangPelanggan.destroy({
        where: { id_piutang_pelanggan: req.params.id },
      });

      res
        .status(200)
        .json({ message: "PiutangPelanggan successfully deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Routes for Pembayaran Piutang
router.get(
  "/pembayaran-piutang",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      const pembayaran = await PembayaranPiutang.findAll();
      res.json(pembayaran);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/pembayaran-piutang",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      const pembayaran = await PembayaranPiutang.create(req.body);
      res.status(201).json(pembayaran);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/pembayaran-piutang/:id",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      // Update the record
      const [updated] = await PembayaranPiutang.update(req.body, {
        where: { id_pembayaran_piutang: req.params.id },
        returning: true, // Ensure the update method returns the updated records (useful for PostgreSQL)
      });

      if (updated === 0) {
        return res.status(404).json({ error: "PembayaranPiutang not found" });
      }

      // Fetch the updated record
      const updatedPembayaran = await PembayaranPiutang.findByPk(req.params.id);

      res.json(updatedPembayaran);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/pembayaran-piutang/:id",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      // Check if the record exists
      const pembayaran = await PembayaranPiutang.findByPk(req.params.id);

      if (!pembayaran) {
        return res.status(404).json({ error: "PembayaranPiutang not found" });
      }

      // Delete the record
      await PembayaranPiutang.destroy({
        where: { id_pembayaran_piutang: req.params.id },
      });

      res
        .status(200)
        .json({ message: "PembayaranPiutang successfully deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Routes for Proyek
router.get("/proyek", authorizeRole("petugas_keuangan"), async (req, res) => {
  try {
    const proyek = await Proyek.findAll();
    res.json(proyek);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/proyek", authorizeRole("petugas_keuangan"), async (req, res) => {
  try {
    const proyek = await Proyek.create(req.body);
    res.status(201).json(proyek);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put(
  "/proyek/:id",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      // Check if the record exists
      const proyek = await Proyek.findByPk(req.params.id);

      if (!proyek) {
        return res.status(404).json({ error: "Proyek not found" });
      }

      // Update the record
      await Proyek.update(req.body, {
        where: { id_proyek: req.params.id },
      });

      // Fetch the updated record
      const updatedProyek = await Proyek.findByPk(req.params.id);

      res.json(updatedProyek);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/proyek/:id",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      // Check if the record exists
      const proyek = await Proyek.findByPk(req.params.id);

      if (!proyek) {
        return res.status(404).json({ error: "Proyek not found" });
      }

      // Delete the record
      await Proyek.destroy({
        where: { id_proyek: req.params.id },
      });

      res.status(200).json({ message: "Proyek successfully deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Routes for Biaya Proyek
router.get(
  "/biaya-proyek",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      const biaya = await BiayaProyek.findAll();
      res.json(biaya);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/biaya-proyek",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      const biaya = await BiayaProyek.create(req.body);
      res.status(201).json(biaya);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/biaya-proyek/:id",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      // Check if the record exists
      const biaya = await BiayaProyek.findByPk(req.params.id);

      if (!biaya) {
        return res.status(404).json({ error: "BiayaProyek not found" });
      }

      // Update the record
      await BiayaProyek.update(req.body, {
        where: { id_biaya_proyek: req.params.id },
      });

      // Fetch the updated record
      const updatedBiaya = await BiayaProyek.findByPk(req.params.id);

      res.json(updatedBiaya);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/biaya-proyek/:id",
  authorizeRole("petugas_keuangan"),
  async (req, res) => {
    try {
      await BiayaProyek.destroy({
        where: { id_biaya_proyek: req.params.id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
