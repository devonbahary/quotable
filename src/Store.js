import { action, observable, reaction, runInAction } from "mobx";
import { authenticateUser, deleteQuote, getUserQuotes, saveNewQuote } from "./api";
import Quote from "./models/Quote";
import User from "./models/User";

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
    };

    @action setUser = googleUser => {
        this.user = new User(googleUser);
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
        this.quotes = this.quotes.filter(q => q.id !== quote.id);
    };

    onSignIn = async googleUser => {
        const authResponse = googleUser.getAuthResponse();
        const { id_token: token } = authResponse;
        await authenticateUser(token);
        await this.setUser(googleUser);
    };
}

export default Store;