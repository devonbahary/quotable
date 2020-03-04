import { get } from "lodash";
import { action, observable, reaction, runInAction } from "mobx";
import {
    authenticateUser,
    deleteCollection,
    deleteQuote,
    getUserCollections,
    getUserQuotes,
    saveNewCollection,
    saveNewQuote,
} from "./api";
import Quote from "./models/Quote";
import User from "./models/User";
import Collection from "./models/Collection";
import { UNTITLED_COLLECTION } from "./constants";

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

    @action removeCollection = async (collection, removeQuotesInCollection) => {
        await deleteCollection(collection, removeQuotesInCollection);
        runInAction(() => {
            this.collections = this.collections.filter(c => c.id !== collection.id);
            if (removeQuotesInCollection) {
                this.quotes = this.quotes.filter(q => q.collectionId !== collection.id);
            } else {
                this.quotes = this.quotes.map(q => q.collectionId === collection.id ? ({
                    ...q,
                    collectionId: null,
                }) : q);
            }
        });
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
        runInAction(() => {
            quote.id = insertId;
            this.quotes.unshift(quote);
        });
    };

    @action removeQuote = async quote => {
        await deleteQuote(quote);
        runInAction(() => {
            this.quotes = this.quotes.filter(q => q.id !== quote.id);
        });
    };

    getQuoteCountByCollectionId = collectionId => {
        return this.quotes.filter(q => q.collectionId === collectionId).length;
    };

    getCollectionTitleById = collectionId => {
        return get(this.collections.find(c => c.id === collectionId), 'title', UNTITLED_COLLECTION);
    };

    onSignIn = async googleUser => {
        const authResponse = googleUser.getAuthResponse();
        const { id_token: token } = authResponse;
        alert(`token ${JSON.stringify(token)}`);
        await authenticateUser(token);
        await this.setUser(googleUser);
    };
}

export default Store;