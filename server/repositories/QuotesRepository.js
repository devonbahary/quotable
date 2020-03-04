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

    async saveNew(userId, text) {
        return this.query(
            `INSERT INTO ${this.tableName}
            (user_id, text)
            VALUES
            (?, ?)`
        , [ userId, text ]);
    };

    deleteByCollectionId(collectionId) {
        return this.query(
            `DELETE
            FROM ${this.tableName}
            WHERE collection_id = ?`,
            [ collectionId ],
        );
    }
};