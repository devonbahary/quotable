import express from "express";
import { validateUser } from "../auth";
import { errorHandler, ownerHandler } from "./util";
import QuotesRepository from "../repositories/QuotesRepository";

const router = express.Router();
const quotesRepository = new QuotesRepository();


router.get('/', validateUser, async (req, res) => {
    errorHandler(res, async () => {
        const quotes = await quotesRepository.findByUserId(req.user.id);
        res.send(quotes);
    });
});

router.post('/', validateUser, async (req, res) => {
    const { collectionId, text } = req.body;

    errorHandler(res, async () => {
        const { insertId } = await quotesRepository.saveNew(req.user.id, text, collectionId);
        res.send({ insertId });
    });
});

router.put('/:id', validateUser, async (req, res) => {
    const { id: quoteId } = req.params;
    const { collectionId, text } = req.body;

    errorHandler(res, () => {
        ownerHandler(quotesRepository, quoteId, req.user.id, res, async () => {
            await quotesRepository.updateById(quoteId, collectionId, text);
            res.sendStatus(200);
        });
    });
});

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