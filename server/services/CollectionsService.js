import CollectionsRepository from "../repositories/CollectionsRepository";
import QuotesRepository from "../repositories/QuotesRepository";

export default class CollectionsService {
    constructor() {
        this.collectionsRepository = new CollectionsRepository();
        this.quotesRepository = new QuotesRepository();
    };

    async deleteCollection (collectionId, removeQuotesInCollection) {
        // delete quotes first because quotes foreign key constraint on collection_id is ON DELETE SET NULL
        if (removeQuotesInCollection) await this.quotesRepository.deleteByCollectionId(collectionId);
        await this.collectionsRepository.deleteById(collectionId);
    };
};