import { debounce, get, orderBy, toLower } from "lodash";
import { action, computed, observable, runInAction } from "mobx";

import AuthorModel from "./models/relational-items/AuthorModel";
import CollectionModel from "./models/relational-items/CollectionModel";
import QuoteModel from "./models/QuoteModel";
import TopicModel from "./models/relational-items/TopicModel";
import UserModel from "./models/UserModel";

import {
    deleteAuthor,
    deleteCollection,
    deleteQuote,
    deleteTopic,
    saveNewAuthor,
    saveNewCollection,
    saveNewQuote,
    saveNewTopic,
} from "./api/CRUD";
import { authenticateUser, getUser } from "./api/user"

import { UNNAMED_AUTHOR } from "./components/views/Authors";
import { UNNAMED_COLLECTION } from "./components/views/Collections";
import { UNNAMED_TOPIC } from "./components/views/Topics";


class Store {
    @observable authors = [];
    @observable collections = [];
    @observable quotes = [];
    @observable topics = [];
    @observable user;
    @observable isLoadingUserResources = true;

    // GETTERS
    @computed get sortedAuthors() {
        return orderBy(this.authors, [ a => toLower(a.name) ], [ 'asc' ]);
    };

    @computed get sortedCollections() {
        return orderBy(this.collections, [ c => toLower(c.name) ], [ 'asc' ]);
    };

    @computed get sortedQuotes() {
        return orderBy(this.quotes, [ q => new Date(q.updatedAt) ], [ 'desc' ]);
    };

    @computed get sortedTopics() {
        return orderBy(this.topics, [ t => toLower(t.name) ], [ 'asc' ]);
    };

    getAuthorNameById = authorId => {
        return get(this.authors.find(a => a.id === authorId), 'name', UNNAMED_AUTHOR);
    };

    getCollectionNameById = collectionId => {
        return get(this.collections.find(c => c.id === collectionId), 'name', UNNAMED_COLLECTION);
    };

    getTopicNameById = topicId => {
        return get(this.topics.find(t => t.id === topicId), 'name', UNNAMED_TOPIC);
    };

    getQuoteCountByAuthorId = authorId => {
        return authorId ? this.quotes.filter(q => q.authorId === authorId).length : 0;
    };

    getQuoteCountByCollectionId = collectionId => {
        return collectionId ? this.quotes.filter(q => q.collectionId === collectionId).length : 0;
    };

    getQuoteCountByTopicId = topicId => {
        return topicId ? this.quotes.filter(q => q.topicId === topicId).length : 0;
    };

    // ACTIONS
    addAuthor = async author => this.addRelationalItem(author, this.authors, saveNewAuthor);
    addCollection = async collection => this.addRelationalItem(collection, this.collections, saveNewCollection);
    addTopic = async topic => this.addRelationalItem(topic, this.topics, saveNewTopic);

    @action addRelationalItem = async (item, storeItems, apiCall) => {
        item.isSaving = true;
        const { insertId } = await apiCall(item);
        runInAction(() => {
            item.id = insertId;
            storeItems.unshift(item);
            item.isSaving = false;
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

    removeAuthor = async (author, removeQuotesByAuthor) => {
        await this.removeRelationalItem(author, 'authors', 'authorId', deleteAuthor, removeQuotesByAuthor);
    };

    removeCollection = async (collection, removeQuotesInCollection) => {
        await this.removeRelationalItem(collection, 'collections', 'collectionId', deleteCollection, removeQuotesInCollection);
    };

    removeTopic = async (topic, removeQuotesInTopic) => {
        await this.removeRelationalItem(topic, 'topics', 'topicId', deleteTopic, removeQuotesInTopic);
    };

    @action removeQuote = async quote => {
        await deleteQuote(quote);
        runInAction(() => {
            this.quotes = this.quotes.filter(q => q.id !== quote.id);
        });
    };

    @action removeRelationalItem = async (item, storeItemsProp, itemProp, apiCall, removeRelatedQuotes = false) => {
        await apiCall(item, removeRelatedQuotes);

        runInAction(() => {
            this[storeItemsProp] = this[storeItemsProp].filter(i => i.id !== item.id);

            if (removeRelatedQuotes) {
                this.quotes = this.quotes.filter(q => q[itemProp] !== item.id);
            } else {
                this.quotes = this.quotes.map(q => q[itemProp] === item.id ? ({ ...q, [itemProp]: null }) : q);
            }
        });
    };

    @action setUser = async googleUser => {
        this.isLoadingUserResources = true;
        this.user = new UserModel();
        this.user.setGoogleProfile(googleUser);
        const {
            authors,
            collections,
            quotes,
            user,
            topics,
        } = await getUser();

        runInAction(() => {
            this.authors = authors.map(a => new AuthorModel(a));
            this.collections = collections.map(c => new CollectionModel(c));
            this.quotes = quotes.map(q => new QuoteModel(q));
            this.topics = topics.map(t => new TopicModel(t));
            this.isLoadingUserResources = false;
        });

        await this.user.setUserSettings(user);
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