import axios from "axios";

export const authenticateUser = async token => {
    const { data: jwt } = await axios.post('/api/authentication/token', { token });
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
};

export const getUserQuotes = async () => {
    const { data: quotes } = await axios.get('/api/quotes');
    return quotes;
};

export const updateQuoteById = async (id, text) => {
    try {
        await axios.put(`/api/quotes/${id}`, { text });
    } catch (err) {
        console.log(err);
    }
};