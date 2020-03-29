import BaseMySQLRepository from "./BaseMySQLRepository";

export default class QuotesRepository extends BaseMySQLRepository {
    constructor() {
        super(
            'quotes',
            QuotesRepository.insertColumns(),
            QuotesRepository.updateColumns(),
        );
    };

    static insertColumns() {
        return [
            'user_id',
            'text',
            'collection_id',
        ];
    }
    static updateColumns() {
        return [
            'collection_id',
            'text',
        ];
    }

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