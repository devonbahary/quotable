import { debounce, get } from "lodash";
import { action, observable, runInAction } from "mobx";
import AuthorModel from "./models/AuthorModel";
import CollectionModel from "./models/CollectionModel";
import QuoteModel from "./models/QuoteModel";
import UserModel from "./models/UserModel";
import {
    authenticateUser,
    deleteAuthor,
    deleteCollection,
    deleteQuote,
    getUser,
    saveNewAuthor,
    saveNewCollection,
    saveNewQuote,
} from "./api";
import { UNTITLED_COLLECTION } from "./components/Collection";


class Store {
    @observable user;
    @observable authors = [];
    @observable collections = [];
    @observable quotes = [];

    getQuoteCountByAuthorId = authorId => {
        if (!authorId) return 0;
        return this.quotes.filter(q => q.authorId === authorId).length;
    };

    getQuoteCountByCollectionId = collectionId => {
        if (!collectionId) return 0;
        return this.quotes.filter(q => q.collectionId === collectionId).length;
    };

    getCollectionTitleById = collectionId => {
        return get(this.collections.find(c => c.id === collectionId), 'title', UNTITLED_COLLECTION);
    };

    @action setUser = async googleUser => {
        this.user = new UserModel();
        this.user.setGoogleProfile(googleUser);
        const {
            authors,
            collections,
            quotes,
            user,
        } = await getUser();

        runInAction(() => {
            this.authors = authors.map(a => new AuthorModel(a));
            this.collections = collections.map(c => new CollectionModel(c));
            this.quotes = quotes.map(q => new QuoteModel(q));
        });

        await this.user.setUserSettings(user);
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

    @action addQuote = async (quote, collectionId = null) => {
        if (!this.collections.some(c => c.id === collectionId)) collectionId = null;

        quote.isSavingText = true;
        const { insertId } = await saveNewQuote(quote, collectionId);

        runInAction(() => {
            quote.id = insertId;
            quote.collectionId = collectionId;
            this.quotes.unshift(quote);
            quote.isSavingText = false;
        });
    };

    @action removeQuote = async quote => {
        await deleteQuote(quote);
        runInAction(() => {
            this.quotes = this.quotes.filter(q => q.id !== quote.id);
        });
    };

    @action addAuthor = async author => {
        author.isSaving = true;
        const { insertId } = await saveNewAuthor(author);
        author.id = insertId;
        this.authors.unshift(author);
        author.isSaving = false;
    };

    @action removeAuthor = async (author, removeQuotesByAuthor) => {
        await deleteAuthor(author, removeQuotesByAuthor);
        runInAction(() => {
            this.authors = this.authors.filter(a => a.id !== author.id);
            if (removeQuotesByAuthor) {
                this.quotes = this.quotes.filter(a => a.authorId !== author.id);
            } else {
                this.quotes = this.quotes.map(a => a.authorId === author.id ? ({
                    ...a,
                    authorId: null,
                }) : a);
            }
        });
    };

    // TODO: can probably get rid of debounce if we leverage gapi.load('auth2', ...) instead of using gapi.signin2.render(...) in <UserModel />
    onSignIn = debounce(async googleUser => { // debounce to prevent multiple signIn calls on page load
        if (this.user) return;
        const authResponse = googleUser.getAuthResponse();
        const { id_token: token } = authResponse;
        await authenticateUser(token);
        await this.setUser(googleUser);
    }, 250);
}

export default Store;