import RelationalItemRepository from "./RelationalItemRepository";

export default class AuthorsRepository extends RelationalItemRepository {
    constructor() {
        super('authors');
    };
};