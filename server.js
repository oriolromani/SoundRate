require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let equipments = [];

app.get('/equipments', (req, res) => {
    res.json(equipments);
});

app.post('/equipments', (req, res) => {
    const equipment = req.body;
    equipments.push(equipment);
    res.status(201).send();
});

app.get('/api-key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
