import {errorHandler} from "./util";
import {validateUser} from "../auth";

export default class CRUD {
    static findByUserId(router) {
        router.get('/', validateUser, async (req, res) => {
            errorHandler(res, async () => {
                const quotes = await quotesRepository.findByUserId(req.user.id);
                res.send(quotes);
            });
        });
    }
}