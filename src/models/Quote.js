import { debounce } from "lodash";
import { action, observable, runInAction } from "mobx";
import { updateQuoteById } from "../api";

export default class Quote {
    @observable text;
    @observable collectionId; // TODO: necessary?
    updatedAt;

    constructor(quote) {
        this.id = quote.id;
        this.collectionId = quote.collection_id;
        this.text = quote.text;
        this.updatedAt = quote.updated_at;
    };

    @action setText = text => {
        this.text = text;
        if (this.id) this.debouncedSaveText();
        this.updatedAt = new Date();
    };

    saveText = async () => {
        await updateQuoteById(this);
        runInAction(() => {
            this.updatedAt = new Date();
        });
    };

    @action updateCollectionId = async collectionId => {
        this.collectionId = collectionId;
        await updateQuoteById(this);
        runInAction(() => {
            this.updatedAt = new Date();
        });
    };

    debouncedSaveText = debounce(this.saveText, 250);
};