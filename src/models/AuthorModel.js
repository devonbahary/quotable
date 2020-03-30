import { observable, runInAction } from "mobx";
import { updateAuthorById } from "../api/CRUD";

export default class AuthorModel {
    @observable name;
    @observable updatedAt;
    @observable isSaving;

    constructor(author = {}) {
        this.id = author.id;
        this.name = author.name || '';
        this.updatedAt = author.updated_at;
        this.isSaving = false;
    };

    save = async () => {
        this.isSaving = true;
        await updateAuthorById(this.id, this.name);

        runInAction(() => {
            this.updatedAt = new Date();
            this.isSaving = false;
        });
    };
};