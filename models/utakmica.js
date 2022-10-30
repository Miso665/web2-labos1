const db = require('../db');

module.exports = class Utakmica {
    constructor(id_utakmice, id_tima1, id_tima2, datum_utakmice, gol1, gol2, rezultat) {
        this.id_utakmice = id_utakmice;
        this.id_tima1 = id_tima1;
        this.id_tima2 = id_tima2;
        this.datum_utakmice = datum_utakmice;
        this.gol1 = gol1;
        this.gol2 = gol2;
        this.rezultat = rezultat;
    }

    static async getAll() {
        return (await db.query(
            `SELECT id_utakmice,
                        id_tima1,
                        tim1.naziv_tima AS naziv_tima1,
                        id_tima2,
                        tim2.naziv_tima AS naziv_tima2,
                        datum_utakmice,
                        gol1,
                        gol2,
                        rezultat,
                        (SELECT COUNT(*) 
                            FROM komentar
                            WHERE komentar.id_utakmice = utakmica.id_utakmice) AS broj_komentara
                        FROM tim tim1 
                            JOIN utakmica
                                ON tim1.id_tima = utakmica.id_tima1
                            JOIN tim tim2
                                ON tim2.id_tima = utakmica.id_tima2
                        ORDER BY datum_utakmice;`
        )).rows;
    }

    static async getUtakmica(id_utakmice) {
        return (await db.query(
            `SELECT id_utakmice,
            id_tima1,
            tim1.naziv_tima AS naziv_tima1,
            id_tima2,
            tim2.naziv_tima AS naziv_tima2,
            datum_utakmice,
            gol1,
            gol2,
            rezultat,
            (SELECT COUNT(*) 
                FROM komentar
                WHERE komentar.id_utakmice = utakmica.id_utakmice) AS broj_komentara
            FROM tim tim1 
                JOIN utakmica
                    ON tim1.id_tima = utakmica.id_tima1
                JOIN tim tim2
                    ON tim2.id_tima = utakmica.id_tima2
            WHERE utakmica.id_utakmice = $1`, [id_utakmice]
        )).rows;
    }

    static async addNew(id_tima1, id_tima2, datum_utakmice) {
        return (await db.query(
            `INSERT INTO utakmica (id_tima1, id_tima2, datum_utakmice)
         VALUES ($1, $2, $3) RETURNING *`, [id_tima1, id_tima2, datum_utakmice]
        ));
    }
    static async update(id_utakmice, gol1, gol2, rezultat) {
        return (await db.query(
            `UPDATE utakmica
            SET gol1 = $1, gol2 = $2, rezultat = $3
            WHERE id_utakmice = $4 RETURNING *`, [gol1, gol2, rezultat, id_utakmice]
        )).rows;
    }
}