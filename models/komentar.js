const db = require('../db');

module.exports = class Komentar {
    constructor(id_komentara, id_utakmice, tekst, email, vrijeme) {
        this.id_komentara = id_komentara;
        this.id_utakmice = id_utakmice;
        this.tekst = tekst;
        this.email = email;
        this.vrijeme = vrijeme
    }

    static async getAll(id_utakmice) {
        return (await db.query(
            `SELECT * FROM komentar
            WHERE id_utakmice = $1`, [id_utakmice]
        )).rows;
    }

    static async addNew(id_utakmice, tekst, email, vrijeme) {
        return (await db.query(
            `INSERT INTO komentar(id_utakmice, tekst, email, vrijeme)
            VALUES ($1, $2, $3, $4) RETURNING *`, [id_utakmice, tekst, email, vrijeme]
        ));
    }

    static async update(id_komentara, tekst, vrijeme) {
        return (await db.query(
            `UPDATE komentar
            SET tekst = $1, vrijeme = $2
            WHERE id_komentara = $3`, [tekst, vrijeme, id_komentara]
        ));
    }

    static async delete(id_komentara) {
        return (await db.query(
            `DELETE FROM komentar
            WHERE id_komentara = $1 RETURNING *`, [id_komentara]
        ));
    }
}