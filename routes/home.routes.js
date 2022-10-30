const express = require("express");
const Utakmica = require("../models/utakmica");
const Komentar = require("../models/komentar")
const router = express.Router();
const req = require("express/lib/request");
const Tim = require("../models/tim");
const { requiresAuth } = require('express-openid-connect');
const { auth } = require('express-openid-connect');
const moment = require("moment-timezone");

const externalUrl = process.env.RENDER_EXTERNAL_URL;

const adminEmail = "supermail@mailinator.com"

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'nesto jako tajno onak bas spooky',
    baseURL: externalUrl || `http://localhost:8080`,
    clientID: 'jsaZ3Mj572s9rm6KIDBzuX62CcfzDahf',
    issuerBaseURL: 'https://dev-h3vlq311.eu.auth0.com',
    clientSecret: process.env.CLIENT_SECRET
  };

router.use(auth(config));

router.get("/utakmice", async (req, res) => {
    try {
        const results = await Utakmica.getAll();
        res.render("pregledUtakmica",
        {
            title: "pregledUtakmica",
            utakmice: results,
            user: req.oidc.user,
            admin: (req.oidc.user && req.oidc.user.email === adminEmail) ? true : false
    })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get('/profile', requiresAuth(), (req, res) => {
    res.render(JSON.stringify(req.oidc.user));
  });

router.get("/utakmica/:idUtakmice", async (req, res) => {
    try {
        const { idUtakmice } = req.params;
        const results = await Utakmica.getUtakmica(idUtakmice);
        const results2 = await Komentar.getAll(idUtakmice);
        res.render("utakmica",
        {
            title: "utakmica",
            utakmica1: results[0],
            komentari: results2,
            user: req.oidc.user,
            admin: (req.oidc.user && req.oidc.user.email === adminEmail) ? true : false
    })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/utakmica/edit", async (req, res) => {
    try {
        if (req.oidc.user && req.oidc.user.email === adminEmail) {
            const { id_utakmice, gol1, gol2 } = req.body;
            let rezultat = 0
            if (gol1 > gol2) rezultat = 1
            else if (gol2 > gol1) rezultat = 2
            const results = await Utakmica.update(id_utakmice, gol1, gol2, rezultat);
            res.status(200);
            return res.json(results);
        } else {
            res.status(401).send()
        }
        

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/tablica", async (req, res) => {
    try {
        const utakmice = await Utakmica.getAll();
        const timovi = await Tim.getAll();
        for (let tim of timovi) {
            let gol_razlika = 0
            let broj_pobjeda = 0
            let broj_poraza = 0
            let broj_remija = 0
            let odigrani_mecevi = 0
            let bodovi = 0
            for (let utakmica of utakmice) {
                if (utakmica.rezultat !== null) {
                    if (tim.id_tima === utakmica.id_tima1) {
                        if (utakmica.rezultat === 1) {
                            broj_pobjeda++;
                            bodovi += 3;
                        }
                        else if (utakmica.rezultat === 2) broj_poraza++;
                        else {
                            broj_remija++;
                            bodovi++;
                        }
                        gol_razlika += (utakmica.gol1 - utakmica.gol2)
                        odigrani_mecevi++;
                    } else if (tim.id_tima === utakmica.id_tima2) {
                        if (utakmica.rezultat === 1) broj_poraza++;
                        else if (utakmica.rezultat === 2) {
                            broj_pobjeda++;
                            bodovi += 3;
                        }
                        else {
                            broj_remija++;
                            bodovi++;
                        }
                        gol_razlika += (utakmica.gol2 - utakmica.gol1)
                        odigrani_mecevi++;
                    }
                } else continue
            }
            tim.broj_pobjeda = broj_pobjeda;
            tim.broj_poraza = broj_poraza;
            tim.broj_remija = broj_remija;
            tim.gol_razlika = gol_razlika;
            tim.odigrani_mecevi = odigrani_mecevi;
            tim.bodovi = bodovi;
        }
        timovi.sort((a, b) => { return b.gol_razlika - a.gol_razlika });
        timovi.sort((a, b) => { return b.bodovi - a.bodovi });
        res.status(200);
        res.render("tablica",
        {
            title: "tablica",
            timovi: timovi,
            user: req.oidc.user,
            admin: (req.oidc.user && req.oidc.user.email === adminEmail) ? true : false
    })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/komentar/:idUtakmice", async (req, res) => {
    try {
        const { idUtakmice } = req.params;
        const results = await Komentar.getAll(idUtakmice);
        return res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/komentar/add", async (req, res) => {
    try {
        if (req.oidc.user) {
            const { id_utakmice, tekst, email } = req.body;
            const zona = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const vrijeme = moment().tz(zona).format();
            const results = await Komentar.addNew(id_utakmice, tekst, email, vrijeme);
            res.status(200)
            return res.json(results);
        } else {
            res.status(401).send();
        }
        

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/komentar/edit", async (req, res) => {
    try {
        const { id_komentara, tekst, email } = req.body;
        if (req.oidc.user && (req.oidc.user.email === email || req.oidc.user.email === adminEmail)) {
            const zona = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const vrijeme = moment().tz(zona).format();
            const results = await Komentar.update(id_komentara, tekst, vrijeme)
            res.status(200);
            return res.json(results);
        } else {
            res.status(401).send()
        }
        

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

router.post("/komentar/delete/:idKomentara", async (req, res) => {
    try {
        const { email } = req.body;
        if (req.oidc.user && (req.oidc.user.email === email || req.oidc.user.email === adminEmail)) {
            const { idKomentara } = req.params;
            const results = await Komentar.delete(idKomentara);
            res.status(200);
            return res.json(results);
        } else {
            res.status(401).send()
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/", (req, res) => {
    res.render("home",
        {
            title: "home",
            user: req.oidc.user,
            admin: (req.oidc.user && req.oidc.user.email === adminEmail) ? true : false
        });
    
});

module.exports = router;