import { get } from "lodash";
import { validateUser } from "../auth";
import { errorHandler, ownerHandler } from "./util";


const getRequestProps = (req, props) => props.reduce((acc, prop) => [
    ...acc,
    get(req, `body.${prop}`), // TODO: should throw error if can't find valid prop?
], []);


export default class CRUDRouter {
    static get(router, repository) {
        router.get('/', validateUser, async (req, res) => {
            errorHandler(res, async () => {
                const quotes = await repository.findByUserId(req.user.id);
                res.send(quotes);
            });
        });
    }

    static post(router, repository, ...props) {
        router.post('/', validateUser, async (req, res) => {
            const requestProps = getRequestProps(req, props);

            errorHandler(res, async () => {
                const { insertId } = await repository.saveNew(req.user.id, ...requestProps);
                res.send({ insertId });
            });
        });
    }

    static put(router, repository, ...props) {
        router.put('/:id', validateUser, async (req, res) => {
            const { id } = req.params;
            const requestProps = getRequestProps(req, props);

            errorHandler(res, () => {
                ownerHandler(repository, id, req.user.id, res, async () => {
                    await repository.updateById(id, ...requestProps);
                    res.sendStatus(200);
                });
            });
        });
    }
}