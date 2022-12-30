const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w89pmsb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const usersCollection = client.db('socialWebApp').collection('users');
        const statusCollection = client.db('socialWebApp').collection('allStatus');

        // Saved user to Database 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // Logged In User
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            res.send(result);
        });

        // Create a Status 
        app.post('/allStatus', async (req, res) => {
            const status = req.body;
            const result = await statusCollection.insertOne(status);
            res.send(result);
        });

        // Get a Status 
        app.get('/allStatus', async (req, res) => {
            const query = {};
            const status = await statusCollection.find(query).toArray();
            res.send(status);
        })
    }
    finally {

    }
} run().catch(er => console.log(er));



app.get('/', (req, res) => {
    res.send('Social web app server running');
});

app.listen(port, () => {
    console.log(`Social App Web Running on port ${port}`);
});