import BaseMySQLRepository from "./BaseMySQLRepository";

export default class AuthorsRepository extends BaseMySQLRepository {
    constructor() {
        super(
            'authors',
            AuthorsRepository.insertColumns(),
            AuthorsRepository.updateColumns(),
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