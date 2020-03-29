import express from "express";
import { validateUser } from "../auth";
import { errorHandler, ownerHandler } from "./util";
import CollectionsRepository from "../repositories/CollectionsRepository";
import CollectionsService from "../services/CollectionsService";
import CRUDRouter from "./CRUDRouter";

const router = express.Router();
const collectionsRepository = new CollectionsRepository();
const collectionsService = new CollectionsService();


CRUDRouter.get(router, collectionsRepository);

CRUDRouter.post(router, collectionsRepository, 'title');

CRUDRouter.put(router, collectionsRepository, 'title');

router.delete('/:id', validateUser, async (req, res) => {
    const { id: collectionId } = req.params;
    const { removeQuotesInCollection } = req.body;

    errorHandler(res, () => {
        ownerHandler(collectionsRepository, collectionId, req.user.id, res, async () => {
            await collectionsService.deleteCollection(collectionId, removeQuotesInCollection);
            res.sendStatus(200);
        });
    });
});

export default router;