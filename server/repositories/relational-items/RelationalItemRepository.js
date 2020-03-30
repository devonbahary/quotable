import BaseMySQLRepository from "../BaseMySQLRepository";

export default class RelationalItemRepository extends BaseMySQLRepository {
    constructor(tableName) {
        super(
            tableName,
            RelationalItemRepository.insertColumns(),
            RelationalItemRepository.updateColumns(),
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