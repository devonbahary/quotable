import { observable, runInAction } from "mobx";
import { updateCollectionById } from "../api/CRUD";

export default class CollectionModel {
    @observable name;
    @observable updatedAt;
    @observable isSaving;

    constructor(collection = {}) {
        this.id = collection.id;
        this.name = collection.name || '';
        this.updatedAt = collection.updated_at;
        this.isSaving = false;
    };

    save = async () => {
        this.isSaving = true;
        await updateCollectionById(this.id, this.name);

        runInAction(() => {
            this.updatedAt = new Date();
            this.isSaving = false;
        });
    };
};