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
            'name',
        ];
    }
    static updateColumns() {
        return [
            'name',
        ];
    }
};