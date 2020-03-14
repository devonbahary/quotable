import express from "express";
import { validateUser } from "../auth";
import { errorHandler } from "./util";
import SubscriptionsRepository from "../repositories/SubscriptionsRepository";

const router = express.Router();
const subscriptionsRepository = new SubscriptionsRepository();

router.post('/', validateUser, async (req, res) => {
    const { subscription } = req.body;
    errorHandler(res, async () => {
        await subscriptionsRepository.upsert(req.user.id, subscription);
        res.sendStatus(201);
    });
});

export default router;