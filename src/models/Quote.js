import { debounce } from "lodash";
import { observable } from "mobx";
import {updateQuoteById} from "../api";

export default class Quote {
    @observable text;

    constructor(quote) {
        this.id = quote.id;
        this.text = quote.text;
    };

    setText = text => {
        this.text = text;
        this.debouncedSaveText();
    };

    saveText = async () => {
        await updateQuoteById(this.id, this.text);
    };

    debouncedSaveText = debounce(this.saveText, 250);
};