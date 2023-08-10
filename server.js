const express = require('express')
const fs = require('fs'); 
const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'));

app.listen(port, () => 
    console.log("Listening on port: ", port)
);

app.get('/', (req, res) => {
    res.send(__dirname + 'index.html')
});

app.get('/data',(req, res) => {
    fs.readFile(__dirname + '/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const jsonData = JSON.parse(data);
        res.send(jsonData);
    });
})