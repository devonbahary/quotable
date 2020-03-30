import express from "express";
import { validateUser } from "../auth";
import { errorHandler, ownerHandler } from "./util";
import AuthorsRepository from "../repositories/AuthorsRepository";
import QuotesService from "../services/QuotesService";
import CRUDRouter from "./CRUDRouter";

const router = express.Router();
const authorsRepository = new AuthorsRepository();
const quotesService = new QuotesService();


CRUDRouter.get(router, authorsRepository);

CRUDRouter.post(router, authorsRepository, 'name');

CRUDRouter.put(router, authorsRepository, 'name');

router.delete('/:id', validateUser, async (req, res) => {
    const { id: authorId } = req.params;
    const { removeQuotesByAuthor } = req.body;

    errorHandler(res, () => {
        ownerHandler(authorsRepository, authorId, req.user.id, res, async () => {
            await quotesService.deleteAuthor(authorId, removeQuotesByAuthor);
            res.sendStatus(200);
        });
    });
});

export default router;