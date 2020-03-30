import RelationalItemRepository from "./RelationalItemRepository";

export default class CollectionsRepository extends RelationalItemRepository {
    constructor() {
        super('collections');
    };
};