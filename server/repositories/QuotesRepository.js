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

    updateById(id, collectionId, text) {
        return this.query(
            `UPDATE ${this.tableName}
            SET collection_id = ?,
            text = ?
            WHERE id = ?`,
            [ collectionId, text, id ],
        );
    };

    async saveNew(userId, collectionId, text) {
        return this.query(
            `INSERT INTO ${this.tableName}
            (collection_id, user_id, text)
            VALUES
            (?, ?, ?)`
        , [ collectionId, userId, text ]);
    };

    deleteByCollectionId(collectionId) {
        return this.query(
            `DELETE
            FROM ${this.tableName}
            WHERE collection_id = ?`,
            [ collectionId ],
        );
    }

    getRandomUserQuote(userId) {
        return this.querySingle(
            `SELECT *
            FROM ${this.tableName}
            WHERE user_id = ?
            ORDER BY RAND()
            LIMIT 1`,
            [ userId ],
        );
    };
};