import axios from "axios";
import { errorHandler } from "./util";

export const uploadImageForTextDetection = formData => {
    return errorHandler(async () => {
        const { data } = await axios.post('/api/google-cloud-vision', formData);
        return data;
    });
};