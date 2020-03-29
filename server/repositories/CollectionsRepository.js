import BaseMySQLRepository from "./BaseMySQLRepository";

export default class CollectionsRepository extends BaseMySQLRepository {
    constructor() {
        super(
            'collections',
            CollectionsRepository.insertColumns(),
            CollectionsRepository.updateColumns(),
        );
    };

    static insertColumns() {
        return [
            'user_id',
            'title',
        ];
    }
    static updateColumns() {
        return [
            'title',
        ];
    }

    async saveNew(userId, title) {
        return super.saveNew(userId, title);
    };
};