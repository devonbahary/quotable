import { observable, runInAction } from "mobx";
import { updateCollectionById } from "../api";

export default class Collection {
    @observable title;
    @observable updatedAt;

    constructor(collection) {
        this.id = collection.id;
        this.title = collection.title;
        this.updatedAt = collection.updated_at;
    };

    save = async () => {
        await updateCollectionById(this.id, this.title);

        runInAction(() => {
            this.updatedAt = new Date();
        });
    };
};