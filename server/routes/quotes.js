import express from "express";
import { validateUser } from "../auth";
import { errorHandler, ownerHandler } from "./util";
import QuotesRepository from "../repositories/QuotesRepository";
import CRUDRouter from "./CRUDRouter";

const router = express.Router();
const quotesRepository = new QuotesRepository();


// CRUDRouter.get(router, quotesRepository); TODO: not needed?

CRUDRouter.post(router, quotesRepository, 'collectionId', 'text');

CRUDRouter.put(router, quotesRepository, 'authorId', 'collectionId', 'text');

router.delete('/:id', validateUser, async (req, res) => {
    const { id: quoteId } = req.params;

    errorHandler(res, () => {
        ownerHandler(quotesRepository, quoteId, req.user.id, res, async () => {
            await quotesRepository.deleteById(quoteId);
            res.sendStatus(200);
        });
    });
});

export default router;