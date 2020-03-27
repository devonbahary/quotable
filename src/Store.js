import { debounce, get } from "lodash";
import { action, observable, reaction, runInAction } from "mobx";
import Quote from "./models/Quote";
import User from "./models/User";
import Collection from "./models/Collection";
import { UNTITLED_COLLECTION } from "./components/Collection";
import {
    authenticateUser,
    deleteCollection,
    deleteQuote,
    getUserCollections,
    getUserQuotes,
    getUserSettings,
    saveNewCollection,
    saveNewQuote,
} from "./api";


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

    @action setUser = async googleUser => {
        this.user = new User();
        this.user.setGoogleProfile(googleUser);
        const userSettings = await getUserSettings();
        await this.user.setUserSettings(userSettings);
    };

    @action getUserCollections = async () => {
        if (!this.user) return;

        const collections = await getUserCollections();
        runInAction(() => {
            this.collections = collections.map(c => new Collection(c));
        });
    };

    @action addCollection = async collection => {
        collection.isSaving = true;
        const { insertId } = await saveNewCollection(collection);
        collection.id = insertId;
        this.collections.unshift(collection);
        collection.isSaving = false;
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

    @action addQuote = async (quote, collectionId = null) => {
        if (!this.collections.some(c => c.id === collectionId)) collectionId = null;

        quote.isSaving = true;
        const { insertId } = await saveNewQuote(quote, collectionId);

        runInAction(() => {
            quote.id = insertId;
            quote.collectionId = collectionId;
            this.quotes.unshift(quote);
            quote.isSaving = false;
        });
    };

    @action removeQuote = async quote => {
        await deleteQuote(quote);
        runInAction(() => {
            this.quotes = this.quotes.filter(q => q.id !== quote.id);
        });
    };

    getQuoteCountByCollectionId = collectionId => {
        if (!collectionId) return 0;
        return this.quotes.filter(q => q.collectionId === collectionId).length;
    };

    getCollectionTitleById = collectionId => {
        return get(this.collections.find(c => c.id === collectionId), 'title', UNTITLED_COLLECTION);
    };

    // TODO: can probably get rid of debounce if we leverage gapi.load('auth2', ...) instead of using gapi.signin2.render(...) in <User />
    onSignIn = debounce(async googleUser => { // debounce to prevent multiple signIn calls on page load
        if (this.user) return;
        const authResponse = googleUser.getAuthResponse();
        const { id_token: token } = authResponse;
        await authenticateUser(token);
        await this.setUser(googleUser);
    }, 250);
}

export default Store;