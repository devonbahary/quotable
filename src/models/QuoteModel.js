import { debounce } from "lodash";
import { action, observable, runInAction } from "mobx";
import { updateQuoteById } from "../api/CRUD";

export default class QuoteModel {
    @observable text;
    @observable updatedAt;

    @observable isSavingText;
    @observable isUpdatingAuthor;
    @observable isUpdatingCollection;


    constructor(quote) {
        this.id = quote.id;
        this.authorId = quote.author_id;
        this.collectionId = quote.collection_id;
        this.text = quote.text || '';
        this.topicId = quote.topic_id;
        this.updatedAt = quote.updated_at;

        this.isSavingText = false;
        this.isUpdatingAuthor = false;
        this.isUpdatingCollection = false;
    };

    @action setText = text => {
        if (text.length > 4000) text = text.slice(0, 4000);
        this.text = text;
        if (this.id) this.debouncedSaveText();
    };

    saveText = async () => {
        this.isSavingText = true;
        await updateQuoteById(this);
        runInAction(() => {
            this.updatedAt = new Date();
            this.isSavingText = false;
        });
    };

    // TODO: refactor these 3?
    @action updateAuthorId = async authorId => {
        this.isUpdatingAuthor = true;
        await updateQuoteById({
            ...this,
            authorId,
        });
        runInAction(() => {
            this.authorId = authorId;
            this.updatedAt = new Date();
            this.isUpdatingAuthor = false;
        });
    };

    @action updateCollectionId = async collectionId => {
        this.isUpdatingCollection = true;
        await updateQuoteById({
            ...this,
            collectionId,
        });
        runInAction(() => {
            this.collectionId = collectionId;
            this.updatedAt = new Date();
            this.isUpdatingCollection = false;
        });
    };

    @action updateTopicId = async topicId => {
        this.isUpdatingAuthor = true;
        await updateQuoteById({
            ...this,
            topicId,
        });
        runInAction(() => {
            this.topicId = topicId;
            this.updatedAt = new Date();
            this.isUpdatingAuthor = false;
        });
    };

    debouncedSaveText = debounce(this.saveText, 250);
};