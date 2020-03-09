import express from "express";
import webpush from "web-push";
import UsersRepository from "../repositories/UsersRepository";
import { validateUser } from "../auth";
import { errorHandler } from "./util";
import config from "../config";

const router = express.Router();
const usersRepository = new UsersRepository();


webpush.setVapidDetails(`mailto:${config.vapid.emailAddress}`, config.vapid.publicKey, config.vapid.privateKey);


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

        res.status(201).send({});
    });

    // TODO: temporary testing
    const payload = JSON.stringify({ title: 'Test Notification Title' });

    setTimeout(async () => {
        await webpush.sendNotification(subscription, payload).catch(err => console.error(err));
    }, 10000);
});

export default router;