const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');

var cors = require('cors')

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
app.get('/get_movies', (req, res, next) => {
    const search = req.query.searchTerm
    let url = process.env.OMDB_HOST + "?s=" + search + "&type=" + process.env.OMDB_TYPE + "&apikey=" + process.env.OMDB_API_KEY
    axios({
        method: 'get',
        url
    }).then(function (response) {
        res.send(JSON.stringify(response.data.Search))
    }).catch(function (error) {
        console.log(error)
    })
})
