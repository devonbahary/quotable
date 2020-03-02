import express from "express";
import { validateUser } from "../auth";
import { errorHandler } from "./util";
import CollectionsRepository from "../repositories/CollectionsRepository";

const router = express.Router();
const collectionsRepository = new CollectionsRepository();

router.get('/', validateUser, (req, res) => {
    errorHandler(res, async () => {
        const collections = await collectionsRepository.findByUserId(req.user.id);
        res.send(collections);
    });
});

router.put('/:id', validateUser, (req, res) => {
    const { id: collectionId } = req.params;
    const { title } = req.body;

    errorHandler(res, async () => {
        const quote = await collectionsRepository.findById(collectionId);
        if (req.user.id !== quote.user_id) return res.sendStatus(403);

        await collectionsRepository.updateTitle(collectionId, title);
        res.sendStatus(200);
    });
});

export default router;