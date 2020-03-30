import express from "express";
import { validateUser } from "../auth";
import { errorHandler, ownerHandler } from "./util";
import CollectionsRepository from "../repositories/CollectionsRepository";
import QuotesService from "../services/QuotesService";
import CRUDRouter from "./CRUDRouter";

const router = express.Router();
const collectionsRepository = new CollectionsRepository();
const quotesService = new QuotesService();


// CRUDRouter.get(router, collectionsRepository); TODO: not needed?

CRUDRouter.post(router, collectionsRepository, 'title');

CRUDRouter.put(router, collectionsRepository, 'title');

router.delete('/:id', validateUser, async (req, res) => {
    const { id: collectionId } = req.params;
    const { removeQuotesInCollection } = req.body;

    errorHandler(res, () => {
        ownerHandler(collectionsRepository, collectionId, req.user.id, res, async () => {
            await quotesService.deleteCollection(collectionId, removeQuotesInCollection);
            res.sendStatus(200);
        });
    });
});

export default router;