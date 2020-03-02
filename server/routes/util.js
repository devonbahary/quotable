export const errorHandler = (res, cb) => {
    try {
        cb();
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
};