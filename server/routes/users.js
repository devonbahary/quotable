import { entries } from "lodash";
import { camelCase } from "change-case";
import express from "express";
import AuthorsRepository from "../repositories/relational-items/AuthorsRepository";
import CollectionsRepository from "../repositories/relational-items/CollectionsRepository";
import QuotesRepository from "../repositories/QuotesRepository";
import UsersRepository from "../repositories/UsersRepository";
import { validateUser } from "../auth";
import { errorHandler } from "./util";
import TopicsRepository from "../repositories/relational-items/TopicsRepository";

const router = express.Router();
const authorsRepository = new AuthorsRepository();
const collectionsRepository = new CollectionsRepository();
const quotesRepository = new QuotesRepository();
const topicsRepository = new TopicsRepository();
const usersRepository = new UsersRepository();


router.get('/me', validateUser, async (req, res) => {
    const user = entries(req.user).reduce((acc, [ key, val ]) => ({
        ...acc,
        [camelCase(key)]: val
    }), {});

    const userId = req.user.id;

    const [
        authors,
        collections,
        quotes,
        topics,
    ] = await Promise.all([
        authorsRepository.findByUserId(userId),
        collectionsRepository.findByUserId(userId),
        quotesRepository.findByUserId(userId),
        topicsRepository.findByUserId(userId),
    ]);

    res.send({
        authors,
        collections,
        quotes,
        topics,
        user,
    });
});

router.put('/me', validateUser, async (req, res) => {
    const { isNotificationsOn } = req.body;
    errorHandler(res, async () => {
        await usersRepository.updateNotifications(req.user.id, isNotificationsOn);
        res.send(200);
    });
});

export default router;