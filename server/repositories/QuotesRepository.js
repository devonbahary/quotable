import BaseMySQLRepository from "./BaseMySQLRepository";

export default class QuotesRepository extends BaseMySQLRepository {
    constructor() {
        super('quotes', [ 'user_id', 'text', 'collection_id' ]);
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

    async saveNew(userId, text, collectionId) {
        return super.saveNew(userId, text, collectionId);
    };

    deleteByCollectionId(collectionId) {
        return this.query(
            `DELETE
            FROM ${this.tableName}
            WHERE collection_id = ?`,
            [ collectionId ],
        );
    }

    getRandomUserQuote(userId, filterQuoteId = null) {
        let sql = `
            SELECT *
            FROM ${this.tableName}
            WHERE user_id = ?
        `;

        const values = [ userId ];

        if (filterQuoteId) {
            sql += ` and id != ?`;
            values.push(filterQuoteId);
        }

        sql += `
            ORDER BY RAND()
            LIMIT 1
        `;

        return this.querySingle(
            sql,
            values,
        );
    };
};