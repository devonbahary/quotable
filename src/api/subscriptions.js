import axios from "axios";
import { errorHandler } from "./util";

export const updatePushNotificationSubscription = subscription => {
    return errorHandler(async () => {
        await axios.post('/api/subscriptions', { subscription });
    });
};