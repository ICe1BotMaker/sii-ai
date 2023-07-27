# sii-ai

I made an ai using **tfjs** to answer only with sii.

### Problems

Sometimes, ai can give the same answer, so be careful.

To solve it, replace the `run` function in the `index.js` file as follows:

```js
const model = await trainModel();

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
```

_**WARNING: This code is the code that runs the server after learning the model. Depending on your computer's specifications, it may take a long time**_

### Usage

Type the command in the terminal as follows:

```
$ git clone https://github.com/ICe1BotMaker/sii-ai.git
$ cd sii-ai
$ npm install
$ node .
```

Then open the `index.html` file, or open the html with the **live server extension in vscode**.

Enter the message, press the transfer button, and wait for the output of the ai model.