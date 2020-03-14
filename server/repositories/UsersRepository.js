import BaseMySQLRepository from "./BaseMySQLRepository";

export default class UsersRepository extends BaseMySQLRepository {
    constructor() {
        super('users', [ 'provider_id' ]);
    };

    async findOrCreateByExternalId(providerId) {
        const user = await this.querySingle(
            `SELECT *
            FROM ${this.tableName}
            WHERE provider_id = ?`,
            [ providerId ],
        );

        if (user) return user;

        const { insertId } = await this.saveNew(providerId);

        return this.findById(insertId);
    };

    updatePushNotificationSubscription(userId, subscription) {
        return this.query(
            `UPDATE ${this.tableName}
            SET push_notification_subscription = ?
            WHERE id = ?`,
            [ subscription, userId ],
        );
    };

    updateNotifications(userId, isOn = 0) {
        isOn = isOn ? 1 : 0; // type conformation

        return this.query(
            `UPDATE ${this.tableName}
            SET is_notifications_on = ?
            WHERE id = ?`,
            [ isOn, userId ],
        );
    }

    updateDailyQuote(userId, quoteId) {
        return this.query(
            `UPDATE ${this.tableName}
            SET todays_quote_id = ?
            WHERE id = ?`,
            [ quoteId, userId ],
        );
    };
};