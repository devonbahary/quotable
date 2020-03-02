import axios from "axios";

const COLLECTIONS_PATH = `/api/collections`;
const QUOTES_PATH = `/api/quotes`;


const errorHandler = cb => {
    try {
        return cb();
    } catch (err) {
        console.error(err);
    }
};

export const authenticateUser = async token => {
    const { data: jwt } = await axios.post('/api/authentication/token', { token });
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
};

export const getUserCollections = async () => {
    return errorHandler(async () => {
        const { data: collections } = await axios.get(COLLECTIONS_PATH);
        return collections;
    });
};

export const updateCollectionById = async (id, title) => {
    return errorHandler(async () => {
        await axios.put(`${COLLECTIONS_PATH}/${id}`, { title });
    });
};

export const saveNewCollection = async collection => {
    return errorHandler(async () => {
        const { data } = await axios.post(COLLECTIONS_PATH, collection);
        return data;
    });
};

export const deleteCollection = async collection => {
    return errorHandler(async () => {
        await axios.delete(`${COLLECTIONS_PATH}/${collection.id}`);
    });
};

export const getUserQuotes = async () => {
    return errorHandler(async () => {
        const { data: quotes } = await axios.get(QUOTES_PATH);
        return quotes;
    });
};

export const updateQuoteById = async (id, text) => {
    return errorHandler(async () => {
        await axios.put(`${QUOTES_PATH}/${id}`, { text });
    });
};

export const saveNewQuote = async quote => {
    return errorHandler(async () => {
        const { data } = await axios.post(QUOTES_PATH, quote);
        return data;
    });
};

export const deleteQuote = async quote => {
    return errorHandler(async () => {
        await axios.delete(`${QUOTES_PATH}/${quote.id}`);
    });
};