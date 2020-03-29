import { debounce } from "lodash";
import { action, observable, runInAction } from "mobx";
import { updateQuoteById } from "../api";

export default class QuoteModel {
    @observable text;
    @observable isSavingText;
    @observable isUpdatingCollection;

    constructor(quote) {
        this.id = quote.id;
        this.collectionId = quote.collection_id;
        this.text = quote.text;
        this.updatedAt = quote.updated_at;
        this.isSavingText = false;
        this.isUpdatingCollection = false;
    };

    @action setText = text => {
        if (text.length > 4000) text = text.slice(0, 4000);
        this.text = text;
        if (this.id) this.debouncedSaveText();
        this.updatedAt = new Date();
    };

    saveText = async () => {
        this.isSavingText = true;
        await updateQuoteById(this);
        runInAction(() => {
            this.updatedAt = new Date();
            this.isSavingText = false;
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

    debouncedSaveText = debounce(this.saveText, 250);
};