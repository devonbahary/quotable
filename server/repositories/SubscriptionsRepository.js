import BaseMySQLRepository from "./BaseMySQLRepository";

export default class SubscriptionsRepository extends BaseMySQLRepository {
    constructor() {
        super('subscriptions', [ 'user_id', 'endpoint', 'subscription' ]);
    };

    async upsert(userId, subscription) {
        const { endpoint } = subscription;
        const stringifiedSubscription = JSON.stringify(subscription);

        const existingSubscription = await this.querySingle(
            `SELECT id, user_id
            FROM ${this.tableName}
            WHERE endpoint = ?`,
            [ endpoint ]
        );

        if (!existingSubscription) return this.saveNew(userId, endpoint, stringifiedSubscription);

        return this.query(
            `UPDATE ${this.tableName}
            SET subscription = ?,
            user_id = ?
            WHERE id = ?`,
            [ stringifiedSubscription, userId, existingSubscription.id ],
        );
    };

    findByUserId(userId) {
        return this.query(
            `SELECT subscription
            FROM ${this.tableName}
            WHERE user_id = ?`,
            [ userId ],
        );
    };
};