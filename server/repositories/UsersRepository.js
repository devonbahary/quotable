import BaseMySQLRepository from "./BaseMySQLRepository";

export default class UsersRepository extends BaseMySQLRepository {
    constructor() {
        super('users');
    };

    async findOrCreateByExternalId(providerId) {
        const user = await this.querySingle(
            `SELECT *
            FROM ${this.tableName}
            WHERE provider_id = ?`,
            [ providerId ],
        );

        if (user) return user;

        const { insertId } = await this.query(
            `INSERT INTO
            ${this.tableName} (provider_id)
            VALUES (?)`,
            [ providerId ],
        );

        return this.findById(insertId);
    };
};