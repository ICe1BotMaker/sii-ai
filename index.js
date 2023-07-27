const fs = require(`fs`);
const express = require(`express`);
const cors = require(`cors`);
const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

const conversations = JSON.parse(fs.readFileSync(`./sii.json`));

async function trainModel() {
    const sentences = conversations.map((conv) => conv.input);
    const embeddings = await use.load();
    const encodings = await Promise.all(sentences.map(async (sentence) => {
        const sentenceEncoding = await embeddings.embed([sentence]);
        return sentenceEncoding.arraySync()[0];
    }));

    const xs = tf.tensor2d(encodings, [encodings.length, 512], 'float32');
    const ys = tf.oneHot(
        conversations.map((conv, index) => index),
        conversations.length
    );

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [512] }));
    model.add(tf.layers.dense({ units: conversations.length, activation: 'softmax' }));
    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });

    await model.fit(xs, ys, { epochs: 100 });

    return model;
}

async function predict(inputText, model) {
    const embeddings = await use.load();
    const inputEncoding = await embeddings.embed([inputText]);
    const inputTensor = tf.tensor2d(inputEncoding.arraySync()[0], [1, 512], 'float32');

    const predictions = await model.predict(inputTensor);
    const predictedIndex = predictions.argMax(1).dataSync()[0];
    const response = conversations[predictedIndex].output;

    return response;
}

async function run() {
    const model = await tf.models.modelFromJSON(JSON.parse(fs.readFileSync(`./model.json`, 'utf-8')));

    const app = express();

    app.use(express.json());
    app.use(cors());

    app.post(`/sii`, async (req, res) => {
        const response = await predict(req.body.message, model);
        res.send(JSON.stringify({ message: response }, null, 4));
    });

    app.listen(8080, () => {
        console.log(`\nPOST localhost:8080/sii\n`);
    });
}

run();