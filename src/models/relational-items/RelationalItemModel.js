import { observable, runInAction } from "mobx";

export default class RelationalItemModel {
    @observable name;
    @observable updatedAt;
    @observable isSaving;

    constructor(item = {}, updateItemById) {
        this.id = item.id;
        this.name = item.name || '';
        this.updatedAt = item.updated_at;

        this.isSaving = false;
        this.updateItemById = updateItemById;
    };

    save = async () => {
        this.isSaving = true;
        await this.updateItemById(this.id, this.name);

        runInAction(() => {
            this.updatedAt = new Date();
            this.isSaving = false;
        });
    };
};