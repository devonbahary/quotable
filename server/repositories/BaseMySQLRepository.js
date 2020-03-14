import pool from "../databases/mysql-connect";

export default class BaseMySQLRepository {
    constructor(tableName, insertColumns = []) {
      this.tableName = tableName;
      this.insertColumns = insertColumns;
    };

    query(sql, values = []) {
        return new Promise((resolve, reject) => {
            pool.query(sql, values, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    };

    async querySingle(sql, values) {
        const result = await this.query(sql, values);
        return result.length ? result[0] : null;
    };

    findById(id) {
        return this.querySingle(
            `SELECT *
            FROM ${this.tableName}
            WHERE id = ?`,
            [ id ],
        );
    };

    findAll() {
        return this.query(
            `SELECT *
            FROM ${this.tableName}`,
            [],
        );
    };

    saveNew(...values) {
        return this.query(
            `INSERT INTO ${this.tableName}
            (${this.insertColumns.join(', ')})
            VALUES
            (${this.insertColumns.map(v => '?').join(', ')})`,
            values,
        );
    };

    deleteById(id) {
        return this.query(
            `DELETE
            FROM ${this.tableName}
            WHERE id = ?`,
            [ id ],
        );
    };
};