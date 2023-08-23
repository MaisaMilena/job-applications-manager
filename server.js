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
        res.send(orderData(jsonData));
    });
})

app.post('/data', bodyParser.json(), (req, res) => {
    const body = req.body;

    fs.readFile(__dirname + '/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
    
        const jsonData = JSON.parse(data);
        const elements = Array.from(jsonData)
        const filteredData = filterData(elements, body.status)

        res.send(orderData(filteredData, body.order))
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

// ---------------
/**
 * 
 * @param {[Object]} data an array of applications from data.json
 * @param {[String]} filteredStatus "sent", "passed_rh", "passed_tech", "rejected", "waiting_feedback"
 * @returns filtered job applications
 */
function filterData(data, filteredStatus) {
    if (filteredStatus.length === 0) {
        return data
    }
    var response = new Set()
    data.forEach(application => {
        application.status.forEach( status => {
            if (filteredStatus.includes(String(application.status))) {
                response.add(application)
            }
        })
    })
    return Array.from(response)
}

/**
 * 
 * @param {[Object]} data an array of applications from data.json
 * @param {String} order date_asc, date_desc, alphabetical
 * @returns ordered array
 */
function orderData(data, order = "date_desc") {
    let dataArray = Array.from(data)
    switch (order) {
        case "date_asc":
            return dataArray.sort((a,b) => a.application_timestamp - b.application_timestamp)
        case "date_desc":
            return dataArray.sort((a,b) => b.application_timestamp - a.application_timestamp)
        case "alphabetical":
            return dataArray.sort((a,b) => a.name.localeCompare(b.name))
    }
} 