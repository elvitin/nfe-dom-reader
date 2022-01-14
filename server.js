const express = require('express');
const path = require('path');
const app = express();
let port = process.env.PORT || 5000;

app.use(express.json());


app.use(express.static("gofis"));

app.use('/', function(req, res) {
    res.sendFile(path.join(__dirname +'/gofis/index.html'));
});

app.listen(port, () => {
    console.log('Server is running on ' + port);
});