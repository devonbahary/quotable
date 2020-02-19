import BaseMySQLRepository from "./BaseMySQLRepository";

export default class QuotesRepository extends BaseMySQLRepository {
    constructor() {
        super('quotes');
    };

    findByUserId(userId) {
        return this.query(
            `SELECT *
            FROM ${this.tableName}
            WHERE user_id = ?`,
            [ userId ],
        );
    };

    updateText(id, text) {
        return this.query(
            `UPDATE ${this.tableName}
            SET text = ?
            WHERE id = ?`,
            [ text, id ],
        );
    };
};