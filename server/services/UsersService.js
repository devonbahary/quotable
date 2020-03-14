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
        const users = await this.usersRepository.findAll();
        return Promise.all(users.map(async user => {
            const { id: userId, is_notifications_on, push_notification_subscription } = user;
            const randomQuote = await this.quotesRepository.getRandomUserQuote(userId);

            if (!randomQuote) return;

            await this.usersRepository.updateDailyQuote(user.id, randomQuote.id);

            if (is_notifications_on) {
                const payload = JSON.stringify({ title: 'Daily Quote', body: randomQuote.text });
                await webpush.sendNotification(JSON.parse(push_notification_subscription), payload);
            }
        }));
    };
};