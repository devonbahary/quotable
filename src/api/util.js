export const errorHandler = cb => {
    try {
        return cb();
    } catch (err) {
        console.error(err);
    }
};