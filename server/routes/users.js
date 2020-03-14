import { entries } from "lodash";
import { camelCase } from "change-case";
import express from "express";
import SubscriptionsRepository from "../repositories/SubscriptionsRepository";
import UsersRepository from "../repositories/UsersRepository";
import { validateUser } from "../auth";
import { errorHandler } from "./util";

const router = express.Router();
const subscriptionsRepository = new SubscriptionsRepository();
const usersRepository = new UsersRepository();


router.get('/me', validateUser, (req, res) => {
    const formattedUser = entries(req.user).reduce((acc, [ key, val ]) => ({
        ...acc,
        [camelCase(key)]: val
    }), {});

    res.send(formattedUser);
});

router.put('/me', validateUser, async (req, res) => {
    const { isNotificationsOn } = req.body;
    errorHandler(res, async () => {
        await usersRepository.updateNotifications(req.user.id, isNotificationsOn);
        res.send(200);
    });
});

router.post('/subscribe', validateUser, async (req, res) => {
    const { subscription } = req.body;
    errorHandler(res, async () => {
        await subscriptionsRepository.upsert(req.user.id, subscription);
        res.sendStatus(201);
    });
});

export default router;