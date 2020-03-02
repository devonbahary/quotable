import express from "express";
import { validateUser } from "../auth";
import { errorHandler } from "./util";
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
    const { text } = req.body;

    errorHandler(res, async () => {
        const { insertId } = await quotesRepository.saveNew(req.user.id, text);
        res.send({ insertId });
    });
});

router.put('/:id', validateUser, async (req, res) => {
    const { id: quoteId } = req.params;
    const { text } = req.body;

    errorHandler(res, async () => {
        const quote = await quotesRepository.findById(quoteId);
        if (req.user.id !== quote.user_id) return res.sendStatus(403);

        await quotesRepository.updateText(quoteId, text);
        res.sendStatus(200);
    });
});

router.delete('/:id', validateUser, async (req, res) => {
    const { id: quoteId } = req.params;

    errorHandler(res, async () => {
        const quote = await quotesRepository.findById(quoteId);
        if (req.user.id !== quote.user_id) return res.sendStatus(403);

        await quotesRepository.deleteById(quoteId);
        res.sendStatus(200);
    });
});

export default router;