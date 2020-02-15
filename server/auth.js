import { startsWith } from "lodash";
import jwt from "jsonwebtoken";
import config from "./config";
import UsersRepository from "./repositories/UsersRepository";


export const validateUser = (req, res, next) => {
    const authorization = req.headers['authorization'];

    let token;
    if (startsWith(authorization, 'Bearer ')) token = authorization.split(' ')[1];

    if (token) {
        jwt.verify(token, config.jwt.secret, async (err, decoded) => {
            if (err) return res.sendStatus(403);

            const { sub: userId } = decoded;
            const usersRepository = new UsersRepository();
            const user = await usersRepository.findById(userId);
            if (!user) res.sendStatus(403);

            req.user = user;

            next();
        });

    } else {
        res.sendStatus(403);
    }
};