const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ew9gz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {

        await client.connect();

        const database = client.db('online_volunteer');
        const serviceCollection = database.collection('services');
        const registrationCollection = database.collection('registration');

        // GET API for all services find
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // GET API for one service find
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            console.log(result)
            res.send(result)
        })
        // GET API for all registration find
        app.get('/registration', async (req, res) => {
            const cursor = registrationCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })

        // POST API REGISTRATION
        app.post('/registration', async (req, res) => {
            const cursor = req.body;
            const result = await registrationCollection.insertOne(cursor)
            res.json(result)
        })
        // POST API added new service
        app.post('/services', async (req, res) => {
            const cursor = (req.body);
            const result = await serviceCollection.insertOne(cursor)
            console.log(result)
            res.json(result)
        })
        // DELETE API REGISTRATION
        app.delete('/registration/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await registrationCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Volunteer SerVer Running')
})

app.listen(port, () => {
    console.log('Server is Running Port', port)
})