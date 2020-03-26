import { get } from "lodash";
import express from "express";
import vision from "@google-cloud/vision";
import { errorHandler } from "./util";

const client = new vision.ImageAnnotatorClient();

const router = express.Router();


router.post('/', (req, res) => {
    errorHandler(res, async () => {
        const image = get(req, 'files.image.data');

        const request = {
            image: {
                content: Buffer.from(image).toString('base64'),
            },
            features: [{
                type: 'TEXT_DETECTION',
            }],
        };

        const responseYeah = await client.annotateImage(request);
        const [ response ] = responseYeah;
        let imageToText = get(response, 'fullTextAnnotation.text');

        imageToText = imageToText.replace(/-\n/g, ''); // concatenate strings broken up by "-\n"
        imageToText = imageToText.replace(/[^\n]\n[^\n]/g, ' '); // replace remaining newlines (respect consecutive newlines)

        res.send(imageToText);
    });
});

export default router;