import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import express from "express";
import path from "path";
import authentication from "./routes/authentication";
import collections from "./routes/collections";
import googleCloudVision from "./routes/google-cloud-vision";
import quotes from "./routes/quotes";
import subscriptions from "./routes/subscriptions";
import users from "./routes/users";

const app = express();

app.use(bodyParser.json());
app.use(fileUpload({}));

app.use('/api/authentication', authentication);
app.use('/api/collections', collections);
app.use('/api/google-cloud-vision', googleCloudVision);
app.use('/api/quotes', quotes);
app.use('/api/subscriptions', subscriptions);
app.use('/api/users', users);

if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static(path.resolve(__dirname, '..', 'public')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server listening on port ${port}`));