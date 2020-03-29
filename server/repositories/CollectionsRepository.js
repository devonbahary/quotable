import BaseMySQLRepository from "./BaseMySQLRepository";

export default class CollectionsRepository extends BaseMySQLRepository {
    constructor() {
        super('collections', [ 'user_id', 'title' ]);
    };

    updateTitle(id, title) {
        return this.query(
            `UPDATE ${this.tableName}
            SET title = ?
            WHERE id = ?`,
            [ title, id ],
        );
    };

    async saveNew(userId, title) {
        return super.saveNew(userId, title);
    };
};