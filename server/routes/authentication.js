import jwt from "jsonwebtoken";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import config from "../config";
import UsersRepository from "../repositories/UsersRepository";
import { validateUser } from "../auth";

const googleAuthClient = new OAuth2Client(config.google.clientId);
const router = express.Router();


const generateJSONWebToken = userId => {
    const payload = {};
    const secretKey = config.jwt.secret;
    const options = {
        subject: userId.toString(),
        expiresIn: '24h',
    };

    return jwt.sign(payload, secretKey, options);
};

router.get('/user', validateUser, async (req, res) => {
    res.send(req.user);
});

router.post('/token', async (req, res) => {
    const usersRepository = new UsersRepository();
    const { token } = req.body;

    try {
        // https://developers.google.com/identity/sign-in/web/backend-auth
        const ticket = await googleAuthClient.verifyIdToken({
            idToken: token,
            audience: config.google.clientId,
        });

        const { sub: providerId } = ticket.getPayload();
        const user = await usersRepository.findOrCreateByExternalId(providerId);

        res.send(generateJSONWebToken(user.id));
    } catch (err) {
        res.send(err);
    }
});

export default router;