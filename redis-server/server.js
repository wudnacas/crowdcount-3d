const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());

const client = redis.createClient({
    url: 'redis://10.10.10.84:6379' // Replace with your Redis server URL
});
// http://localhost:3000/api/redis-data
client.connect().catch(console.error);

app.get('/api/redis-data', async (req, res) => {
    try {
        const idList = await client.lRange('id_list', 0, -1);
        const data = {};
        for (const key of idList) {
            const value = await client.hGetAll(key);
            if (Object.keys(value).length > 0) {
                data[key] = Object.fromEntries(
                    Object.entries(value).map(([k, v]) => {
                        const parsedValue = parseFloat(v);
                        return [k, k === 'x' ? parsedValue : parsedValue];
                    })
                );
            }
        }

        res.json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));