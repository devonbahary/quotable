import { debounce } from "lodash";
import { observable } from "mobx";
import {saveNewQuote, updateQuoteById} from "../api";

export default class Quote {
    @observable text;

    constructor(quote) {
        this.id = quote.id;
        this.text = quote.text;
    };

    setText = text => {
        this.text = text;
        if (this.id) this.debouncedSaveText();
    };

    saveText = async () => {
        await updateQuoteById(this.id, this.text);
    };

    saveNew = async () => {
        const { insertId } = await saveNewQuote(this);
        this.id = insertId;
    };

    debouncedSaveText = debounce(this.saveText, 250);
};