const express = require("express");
const Komentar = require("../models/komentar");
const router = express.Router();
const moment = require("moment-timezone");
const req = require("express/lib/request");

router.get("/:idUtakmice", async (req, res) => {
    try {
        const { idUtakmice } = req.params;
        const results = await Komentar.getAll(idUtakmice);
        return res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/add", async (req, res) => {
    try {
        const { id_utakmice, tekst, email } = req.body;
        const zona = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const vrijeme = moment().tz(zona).format();
        const results = await Komentar.addNew(id_utakmice, tekst, email, vrijeme);
        res.status(200)
        return res.json(results);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/edit", async (req, res) => {
    try {
        const { id_komentara, tekst, email } = req.body;
        const zona = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const vrijeme = moment().tz(zona).format();
        const results = await Komentar.update(id_komentara, tekst, vrijeme)
        res.status(200);
        return res.json(results);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

router.post("/delete/:idKomentara", async (req, res) => {
    try {
        const { idKomentara } = req.params;
        const results = await Komentar.delete(idKomentara);
        res.status(200);
        return res.json(results);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;