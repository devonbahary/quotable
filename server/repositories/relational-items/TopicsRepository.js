import RelationalItemRepository from "./RelationalItemRepository";

export default class TopicsRepository extends RelationalItemRepository {
    constructor() {
        super('topics');
    };
};