export const errorHandler = (res, cb) => {
    try {
        cb();
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
};

export const ownerHandler = async (repository, itemId, userId, res, cb) => {
    const item = await repository.findById(itemId);
    if (userId !== item.user_id) return res.sendStatus(403);

    cb();
};