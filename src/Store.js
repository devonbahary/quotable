import { action, observable, reaction, runInAction } from "mobx";
import { getUser, getUserQuotes } from "./api";

class Store {
    @observable user;
    @observable quotes = [];

    constructor() {
        reaction(
            () => this.user,
            async () => {
                await this.getUserQuotes();
            },
        );
    }

    @action getUser = async () => {
        const user = await getUser();
        runInAction(() => {
            this.user = user;
        });
    };

    @action getUserQuotes = async () => {
        if (!this.user) return;

        const quotes = await getUserQuotes();
        runInAction(() => {
            this.quotes = quotes;
        });
    };
}

export default Store;