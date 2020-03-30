import express from "express";
import { validateUser } from "../auth";
import { errorHandler, ownerHandler } from "./util";
import TopicsRepository from "../repositories/relational-items/TopicsRepository";
import QuotesService from "../services/QuotesService";
import CRUDRouter from "./CRUDRouter";

const router = express.Router();
const topicsRepository = new TopicsRepository();
const quotesService = new QuotesService();


// CRUDRouter.get(router, topicsRepository); TODO: not needed?

CRUDRouter.post(router, topicsRepository, 'name');

CRUDRouter.put(router, topicsRepository, 'name');

router.delete('/:id', validateUser, async (req, res) => {
    const { id: topicId } = req.params;
    const { removeQuotesInTopic } = req.body;

    errorHandler(res, () => {
        ownerHandler(topicsRepository, topicId, req.user.id, res, async () => {
            await quotesService.deleteTopic(topicId, removeQuotesInTopic);
            res.sendStatus(200);
        });
    });
});

export default router;