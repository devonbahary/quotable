import express from "express";
import {validateUser} from "../auth";
import QuotesRepository from "../repositories/QuotesRepository";

const router = express.Router();

router.get('/', validateUser, async (req, res) => {
    const quotesRepository = new QuotesRepository();
    const quotes = await quotesRepository.findByUserId(req.user.id);
    res.send(quotes);
});

export default router;