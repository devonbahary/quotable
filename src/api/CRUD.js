import axios from "axios";
import { errorHandler } from "./util";

const AUTHORS_PATH = `/api/authors`;
const COLLECTIONS_PATH = `/api/collections`;
const QUOTES_PATH = `/api/quotes`;


export const saveNewAuthor = async author => {
    return errorHandler(async () => {
        const { data } = await axios.post(AUTHORS_PATH, author);
        return data;
    });
};

export const saveNewCollection = async collection => {
    return errorHandler(async () => {
        const { data } = await axios.post(COLLECTIONS_PATH, collection);
        return data;
    });
};

export const saveNewQuote = async (quote, collectionId) => {
    const quoteWithCollectionId = Object.assign(quote, { collectionId });

    return errorHandler(async () => {
        const { data } = await axios.post(QUOTES_PATH, quoteWithCollectionId);
        return data;
    });
};

export const updateAuthorById = async (id, name) => {
    return errorHandler(async () => {
        await axios.put(`${AUTHORS_PATH}/${id}`, { name });
    });
};

export const updateCollectionById = async (id, name) => {
    return errorHandler(async () => {
        await axios.put(`${COLLECTIONS_PATH}/${id}`, { name });
    });
};

export const updateQuoteById = async quote => {
    return errorHandler(async () => {
        await axios.put(`${QUOTES_PATH}/${quote.id}`, { ...quote });
    });
};

export const deleteAuthor = async (author, removeQuotesByAuthor) => {
    return errorHandler(async () => {
        const config = {
            data: {
                removeQuotesByAuthor,
            },
        };
        await axios.delete(`${AUTHORS_PATH}/${author.id}`, config);
    });
};

export const deleteCollection = async (collection, removeQuotesInCollection) => {
    return errorHandler(async () => {
        const config = {
            data: {
                removeQuotesInCollection,
            },
        };
        await axios.delete(`${COLLECTIONS_PATH}/${collection.id}`, config);
    });
};

export const deleteQuote = async quote => {
    return errorHandler(async () => {
        await axios.delete(`${QUOTES_PATH}/${quote.id}`);
    });
};
