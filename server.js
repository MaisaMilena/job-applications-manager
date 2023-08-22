const express = require('express')
const bodyParser = require('body-parser')
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

app.get('/resume/:file_name',(req, res) => {
    console.log(req)
    let url = __dirname + '/resume/' + req["file_name"]
    fs.readFile(url, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // const jsonData = JSON.parse(data);
        res.sendFile(data);
    });
})

app.post('/data', bodyParser.json(), (req, res) => {
    const body = req.body;
    // console.log(body);

    fs.readFile(__dirname + '/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
    
        const jsonData = JSON.parse(data);
        const elements = Array.from(jsonData)
        const filteredData = filterData(elements, body.status)
    
        res.send(filteredData);
    });
})

// ---------------
function filterData(data, filteredStatus) {
    // console.log(data)
    console.log("Status: ", filteredStatus)
    // ["sent", "passed_rh", "passed_tech", "rejected", "waiting_feedback"]
    var response = new Set()
    data.forEach(application => {
        application.status.forEach( status => {
            if (filteredStatus.includes(String(application.status))) {
                // console.log(" >>> application add")
                response.add(application)
            }
        })
    })
    // console.log(response)
    return Array.from(response)
}