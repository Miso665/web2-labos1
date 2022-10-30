const db = require('../db');

module.exports = class Tim {
    constructor(id_tima, naziv_tima) {
        this.id_tima = id_tima
        this.naziv_tima = naziv_tima
    }

    static async getAll() {
        return (await db.query(
            `SELECT * FROM tim`
        )).rows;
    }
}