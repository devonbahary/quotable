import axios from "axios";

const COLLECTIONS_PATH = `/api/collections`;
const GOOGLE_CLOUD_VISION_PATH = `/api/google-cloud-vision`;
const QUOTES_PATH = `/api/quotes`;
const SUBSCRIPTIONS_PATH = `/api/subscriptions`;
const USERS_PATH = `/api/users`;


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

export const getUserQuotes = async () => {
    return errorHandler(async () => {
        const { data: quotes } = await axios.get(QUOTES_PATH);
        return quotes;
    });
};

export const updateQuoteById = async quote => {
    return errorHandler(async () => {
        await axios.put(`${QUOTES_PATH}/${quote.id}`, { ...quote });
    });
};

export const saveNewQuote = async (quote, collectionId) => {
    const quoteWithCollectionId = Object.assign(quote, { collectionId });

    return errorHandler(async () => {
        const { data } = await axios.post(QUOTES_PATH, quoteWithCollectionId);
        return data;
    });
};

export const deleteQuote = async quote => {
    return errorHandler(async () => {
        await axios.delete(`${QUOTES_PATH}/${quote.id}`);
    });
};

export const getUserSettings = async () => {
    return errorHandler(async () => {
         const { data } = await axios.get(`${USERS_PATH}/me`);
         return data;
    });
};

// TODO: consolidate updateUserSettings + updatePushNotificationSubscription
// or maybe they belong in separate tables?
export const updateUserSettings = async isNotificationsOn => {
    return errorHandler(async () => {
        await axios.put(`${USERS_PATH}/me`, { isNotificationsOn });
    });
};

export const updatePushNotificationSubscription = subscription => {
    return errorHandler(async () => {
        await axios.post(SUBSCRIPTIONS_PATH, { subscription });
    });
};

export const uploadImageForTextDetection = formData => {
    return errorHandler(async () => {
        const { data } = await axios.post(GOOGLE_CLOUD_VISION_PATH, formData);
        return data;
    });
};