import express from "express";
import {validateUser} from "../auth";
import QuotesRepository from "../repositories/QuotesRepository";

const router = express.Router();
const quotesRepository = new QuotesRepository();


router.get('/', validateUser, async (req, res) => {
    try {
        const quotes = await quotesRepository.findByUserId(req.user.id);
        res.send(quotes);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

router.put('/:id', validateUser, async (req, res) => {
    const { id: quoteId } = req.params;
    const { text } = req.body;

    try {
        const quote = await quotesRepository.findById(quoteId);

        if (req.user.id !== quote.user_id) return res.sendStatus(403);

        await quotesRepository.updateText(quoteId, text);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

export default router;