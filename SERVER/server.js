const express = require('express');
const bodyParser = require('body-parser');
const { ChatGPT } = require("@langchain/openai");

const app = express();
const port = process.env.PORT || 3000;

const model = new ChatGPT({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, 
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION, 
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME, 
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME, 
});

let chatHistory = []; // Houdt de chatgeschiedenis bij

app.use(bodyParser.json());

app.post('/interpret', async (req, res) => {
    try {
        const { text } = req.body;

        // Voeg het nieuwe bericht toe aan de chatgeschiedenis
        chatHistory.push(text);

        // Geef de hele chatgeschiedenis door aan het taalmodel
        const response = await model.interpret(text, { chatHistory });

        // Voeg het antwoord van de AI toe aan de chatgeschiedenis
        chatHistory.push(response);

        res.json({ success: true, response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Interne serverfout' });
    }
});

app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}/`);
});
