import { action, observable, reaction, runInAction } from "mobx";
import {
    authenticateUser,
    deleteQuote,
    getUserCollections,
    getUserQuotes,
    saveNewCollection, 
    saveNewQuote,
} from "./api";
import Quote from "./models/Quote";
import User from "./models/User";
import Collection from "./models/Collection";

class Store {
    @observable user;
    @observable collections = [];
    @observable quotes = [];

    constructor() {
        reaction(
            () => this.user,
            async () => {
                await this.getUserCollections();
                await this.getUserQuotes();
            },
        );
    };

    @action setUser = googleUser => {
        this.user = new User(googleUser);
    };

    @action getUserCollections = async () => {
        if (!this.user) return;

        const collections = await getUserCollections();
        runInAction(() => {
            this.collections = collections.map(c => new Collection(c));
        });
    };

    @action addCollection = async collection => {
        const { insertId } = await saveNewCollection(collection);
        collection.id = insertId;
        this.collections.unshift(collection);
    };

    @action getUserQuotes = async () => {
        if (!this.user) return;

        const quotes = await getUserQuotes();
        runInAction(() => {
            this.quotes = quotes.map(q => new Quote(q));
        });
    };

    @action addQuote = async quote => {
        const { insertId } = await saveNewQuote(quote);
        quote.id = insertId;
        this.quotes.unshift(quote);
    };

    @action removeQuote = async quote => {
        await deleteQuote(quote);
        runInAction(() => {
            this.quotes = this.quotes.filter(q => q.id !== quote.id);
        });
    };

    onSignIn = async googleUser => {
        const authResponse = googleUser.getAuthResponse();
        const { id_token: token } = authResponse;
        await authenticateUser(token);
        await this.setUser(googleUser);
    };
}

export default Store;