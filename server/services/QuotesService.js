import AuthorsRepository from "../repositories/relational-items/AuthorsRepository";
import CollectionsRepository from "../repositories/relational-items/CollectionsRepository";
import QuotesRepository from "../repositories/QuotesRepository";
import TopicsRepository from "../repositories/relational-items/TopicsRepository";

export default class QuotesService {
    constructor() {
        this.authorsRepository = new AuthorsRepository();
        this.collectionsRepository = new CollectionsRepository();
        this.quotesRepository = new QuotesRepository();
        this.topicsRepository = new TopicsRepository();
    };

    async deleteAuthor (authorId, removeQuotesByAuthor) {
        // delete quotes first because quotes foreign key constraint on author_id is ON DELETE SET NULL
        if (removeQuotesByAuthor) await this.quotesRepository.deleteByAuthorId(authorId);
        await this.authorsRepository.deleteById(authorId);
    };

    async deleteCollection (collectionId, removeQuotesInCollection) {
        // delete quotes first because quotes foreign key constraint on collection_id is ON DELETE SET NULL
        if (removeQuotesInCollection) await this.quotesRepository.deleteByCollectionId(collectionId);
        await this.collectionsRepository.deleteById(collectionId);
    };

    async deleteTopic (topicId, removeQuotesInTopic) {
        // delete quotes first because quotes foreign key constraint on topic_id is ON DELETE SET NULL
        if (removeQuotesInTopic) await this.quotesRepository.deleteByTopicId(topicId);
        await this.topicsRepository.deleteById(topicId);
    };
};