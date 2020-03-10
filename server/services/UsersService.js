import webpush from "web-push";
import QuotesRepository from "../repositories/QuotesRepository";
import UsersRepository from "../repositories/UsersRepository";
import config from "../config";


webpush.setVapidDetails(`mailto:${config.vapid.emailAddress}`, config.vapid.publicKey, config.vapid.privateKey);


export default class UsersService {
    constructor() {
        this.quotesRepository = new QuotesRepository();
        this.usersRepository = new UsersRepository();
    };

    async assignRandomDailyQuotes() {
        const users = await this.usersRepository.findAllForDailyQuoteUpdate();
        return Promise.all(users.map(async user => {
            const { id: userId, isNotificationsOn, subscription } = user;
            const { id: quoteId, text: quoteText } = await this.quotesRepository.getRandomUserQuote(userId);
            await this.usersRepository.updateDailyQuote(user.id, quoteId);

            if (isNotificationsOn) {
                const payload = JSON.stringify({ title: 'Daily Quote', body: quoteText });
                await webpush.sendNotification(JSON.parse(subscription), payload).catch(err => console.error(err));
            }
        }));
    };
};