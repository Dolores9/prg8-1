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

let todoList = [];

app.use(bodyParser.json());

app.post('/interpret', async (req, res) => {
    try {
        const { text } = req.body;
        const response = await model.interpret(text);

        if (response.intent === "AddTask") {
            const task = response.entities.join(" ");
            todoList.push(task);
            res.json({ success: true, message: `Taak "${task}" is toegevoegd aan de lijst.` });
        } else if (response.intent === "RemoveTask") {
            const task = response.entities.join(" ");
            todoList = todoList.filter(item => !item.includes(task));
            res.json({ success: true, message: `Taak "${task}" is verwijderd van de lijst.` });
        } else {
            res.json({ success: false, message: "Sorry, ik begrijp niet wat je bedoelt." });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Interne serverfout' });
    }
});

app.get('/todolist', (req, res) => {
    res.json({ todoList });
});

app.use(express.static('public')); // Serveer de statische bestanden (HTML, CSS, JS)

app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}/`);
});
