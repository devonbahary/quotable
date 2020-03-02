import BaseMySQLRepository from "./BaseMySQLRepository";

export default class CollectionsRepository extends BaseMySQLRepository {
    constructor() {
        super('collections');
    };

    findByUserId(userId) {
        return this.query(
            `SELECT *
            FROM ${this.tableName}
            WHERE user_id = ?`,
            [ userId ],
        );
    };

    updateTitle(id, title) {
        return this.query(
            `UPDATE ${this.tableName}
            SET title = ?
            WHERE id = ?`,
            [ title, id ],
        );
    };
};