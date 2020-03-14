import { entries } from "lodash";
import { camelCase } from "change-case";
import express from "express";
import UsersRepository from "../repositories/UsersRepository";
import { validateUser } from "../auth";
import { errorHandler } from "./util";

const router = express.Router();
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

export default router;