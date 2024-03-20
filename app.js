const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(compression());
app.use(bodyParser.json());

// MongoDB Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'Business_Quant';

// MongoDB Client
const client = new MongoClient(url, { useUnifiedTopology: true });

// Connect to MongoDB
client.connect(err => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Get filtered stock data
    app.get('/sample_data_historic/:ticker', async (req, res) => {
        const { ticker } = req.params;
        const { column, period } = req.query;

        // Check if all required parameters are provided
        if (!ticker || !column || !period) {
            res.status(400).json({ error: 'Missing required parameters: column or period' });
            return;
        }

        const columns = column.split(',');

        // Calculate the date threshold based on the provided period
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear() - parseInt(period), currentDate.getMonth(), currentDate.getDate());

        try {
            // Construct query
            const query = {
                ticker: ticker,
                date: { $gte: startDate }
            };

            // Project only required columns
            const projection = {};
            columns.forEach(col => projection[col] = 1);

            const result = await db.collection('sample_data_historic').find(query, { projection }).toArray();

            if (result.length === 0) {
                res.status(404).json({ error: 'Data not found for the provided parameters' });
                return;
            }

            res.json(result);
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Add a new stock
    app.post('/sample_data_historic', async (req, res) => {
        const { name, price, quantity } = req.body;
        const document = { name, price, quantity };

        try {
            const result = await db.collection('sample_data_historic').insertOne(document);
            res.json({ message: 'Stock added successfully', insertedId: result.insertedId });
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Update a stock
    app.put('/sample_data_historic/:id', async (req, res) => {
        const id = req.params.id;
        const { name, price, quantity } = req.body;

        try {
            const result = await db.collection('sample_data_historic').updateOne({ _id: ObjectId(id) }, { $set: { name, price, quantity } });

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Stock not found' });
                return;
            }

            res.json({ message: 'Stock updated successfully' });
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Delete a stock
    app.delete('/sample_data_historic/:id', async (req, res) => {
        const id = req.params.id;

        try {
            const result = await db.collection('sample_data_historic').deleteOne({ _id: ObjectId(id) });

            if (result.deletedCount === 0) {
                res.status(404).json({ error: 'Stock not found' });
                return;
            }

            res.json({ message: 'Stock deleted successfully' });
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
