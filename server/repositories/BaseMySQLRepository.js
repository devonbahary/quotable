import pool from "../databases/mysql-connect";

export default class BaseMySQLRepository {
    constructor(tableName) {
      this.tableName = tableName;
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
            `SELECT
            id,
            push_notification_subscription as subscription,
            is_notifications_on as isNotificationsOn
            FROM ${this.tableName}
            WHERE id = ?`,
            [ id ],
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