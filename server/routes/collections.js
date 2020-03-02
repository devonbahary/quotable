import express from "express";
import { validateUser } from "../auth";
import { errorHandler, ownerHandler } from "./util";
import CollectionsRepository from "../repositories/CollectionsRepository";

const router = express.Router();
const collectionsRepository = new CollectionsRepository();

router.get('/', validateUser, (req, res) => {
    errorHandler(res, async () => {
        const collections = await collectionsRepository.findByUserId(req.user.id);
        res.send(collections);
    });
});

router.post('/', validateUser, async (req, res) => {
    const { title } = req.body;

    errorHandler(res, async () => {
        const { insertId } = await collectionsRepository.saveNew(req.user.id, title);
        res.send({ insertId });
    });
});

router.put('/:id', validateUser, (req, res) => {
    const { id: collectionId } = req.params;
    const { title } = req.body;

    errorHandler(res, () => {
        ownerHandler(collectionsRepository, collectionId, req.user.id, res, async () => {
            await collectionsRepository.updateTitle(collectionId, title);
            res.sendStatus(200);
        });
    });
});

export default router;