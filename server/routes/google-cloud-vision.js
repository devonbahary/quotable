import { get } from "lodash";
import express from "express";
import vision from "@google-cloud/vision";
import { errorHandler } from "./util";

const client = new vision.ImageAnnotatorClient();

const router = express.Router();


router.post('/', (req, res) => {
    errorHandler(res, async () => {
        const { image } = req.body;
        const imageBase64 = image.split(',')[1];

        console.log('\nimageBase64', imageBase64, '\n');

        const request = {
            image: {
                content: imageBase64,
            },
            features: [{
                type: 'TEXT_DETECTION',
            }],
        };

        const [ response ] = await client.annotateImage(request);
        const imageToText = get(response, 'fullTextAnnotation.text');

        res.send(imageToText);
    });
});

export default router;