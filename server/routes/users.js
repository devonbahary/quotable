import express from "express";
import UsersRepository from "../repositories/UsersRepository";
import { validateUser } from "../auth";
import { errorHandler } from "./util";

const router = express.Router();
const usersRepository = new UsersRepository();


router.get('/me', validateUser, (req, res) => {
    res.send(req.user);
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
        await usersRepository.updatePushNotificationSubscription(req.user.id, JSON.stringify(subscription));
        res.sendStatus(201);
    });
});

export default router;