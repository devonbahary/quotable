import webpush from "web-push";
import QuotesRepository from "../repositories/QuotesRepository";
import SubscriptionsRepository from "../repositories/SubscriptionsRepository";
import UsersRepository from "../repositories/UsersRepository";
import config from "../config";


webpush.setVapidDetails(`mailto:${config.vapid.emailAddress}`, config.vapid.publicKey, config.vapid.privateKey);


export default class UsersService {
    constructor() {
        this.quotesRepository = new QuotesRepository();
        this.subscriptionsRepository = new SubscriptionsRepository();
        this.usersRepository = new UsersRepository();
    };

    async assignAndNotifyTodaysRandomQuote() {
        const users = await this.usersRepository.findAll();
        return Promise.all(users.map(async user => {
            const { id: userId, is_notifications_on, todays_quote_id } = user;

            let randomQuote = await this.quotesRepository.getRandomUserQuote(userId, todays_quote_id);

            if (!randomQuote && !todays_quote_id) return;
            else if (!randomQuote) randomQuote = await this.quotesRepository.findById(todays_quote_id);

            await this.usersRepository.updateDailyQuote(userId, randomQuote.id);

            if (is_notifications_on) {
                const subscriptions = await this.subscriptionsRepository.findByUserId(userId);

                await Promise.all(subscriptions.map(({ subscription }) => {
                    const payload = JSON.stringify({ title: 'Daily Quote', body: randomQuote.text });
                    return webpush.sendNotification(JSON.parse(subscription), payload);
                }));
            }
        }));
    };
};