import { debounce } from "lodash";
import { observable } from "mobx";
import { updateQuoteById } from "../api";

export default class Quote {
    @observable text;

    constructor(quote) {
        this.id = quote.id;
        this.text = quote.text;
        this.updatedAt = quote.updated_at;
    };

    setText = text => {
        this.text = text;
        if (this.id) this.debouncedSaveText();
        this.updatedAt = new Date();
    };

    saveText = async () => {
        await updateQuoteById(this.id, this.text);
        this.updatedAt = new Date();
    };

    debouncedSaveText = debounce(this.saveText, 250);
};