import axios from "axios";
import { errorHandler } from "./util";

const USERS_PATH = `/api/users/me`;

export const authenticateUser = async token => {
    const { data: jwt } = await axios.post('/api/authentication/token', { token });
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
};

export const getUser = async () => {
    return errorHandler(async () => {
        const { data } = await axios.get(USERS_PATH);
        return data;
    });
};

export const updateUserSettings = async isNotificationsOn => {
    return errorHandler(async () => {
        await axios.put(USERS_PATH, { isNotificationsOn });
    });
};