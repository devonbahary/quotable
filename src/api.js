import axios from "axios";

const COLLECTIONS_PATH = `/api/collections`;
const QUOTES_PATH = `/api/quotes`;

export const authenticateUser = async token => {
    const { data: jwt } = await axios.post('/api/authentication/token', { token });
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
};

export const getUserCollections = async () => {
    const { data: collections } = await axios.get(COLLECTIONS_PATH);
    return collections;
};

export const updateCollectionById = async (id, title) => {
    try {
        await axios.put(`${COLLECTIONS_PATH}/${id}`, { title });
    } catch (err) {
        console.error(err);
    }
};

export const getUserQuotes = async () => {
    try {
        const { data: quotes } = await axios.get(QUOTES_PATH);
        return quotes;
    } catch (err) {
        console.error(err);
    }
};

export const updateQuoteById = async (id, text) => {
    try {
        await axios.put(`${QUOTES_PATH}/${id}`, { text });
    } catch (err) {
        console.error(err);
    }
};

export const saveNewQuote = async quote => {
    try {
        const { data } = await axios.post(QUOTES_PATH, quote);
        return data;
    } catch (err) {
        console.error(err);
    }
};

export const deleteQuote = async quote => {
    try {
        await axios.delete(`${QUOTES_PATH}/${quote.id}`);
    } catch (err) {
        console.error(err);
    }
};