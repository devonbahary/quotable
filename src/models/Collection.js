import { observable } from "mobx";
import {updateCollectionById} from "../api";

export default class Collection {
    @observable title;

    constructor(collection) {
        this.id = collection.id;
        this.title = collection.title;
        this.updatedAt = collection.updated_at;
    };

    setTitle = title => {
        this.title = title;
        this.updatedAt = new Date();
    };

    save = async () => {
        await updateCollectionById(this.id, this.title);
        this.updatedAt = new Date();
    };
};