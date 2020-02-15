import axios from "axios";

export const authenticateUser = async token => {
    const { data: jwt } = await axios.post('/api/authentication/token', { token });
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
};

export const getUser = async () =>  {
    const { data: user } = await axios.get('/api/authentication/user');
    return user;
};

export const getUserQuotes = async () => {
    const { data: quotes } = await axios.get('/api/quotes');
    return quotes;
};