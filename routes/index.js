var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'lessons';

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

router.get('/lessons', function (req, res) {
    const name = req.query.name;
    console.log(`find ${name}`)
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);

        const collection = db.collection('lesson');

        collection.findOne({name}, (err, result) => {
            assert.equal(err, null);
            client.close();
            res.json(result);
        });
    })
});

router.post('/lessons/add', function (req, res) {
    const name = req.body.name;

    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);

        const collection = db.collection('lesson');

        collection.findOne({name}, (err, result) => {
            assert.equal(err, null);

            if (result === null) {
                collection.insertOne(req.body, (err, result) => {
                    client.close();
                    res.json(result);
                })
            }
            else {
                collection.findOneAndReplace({name}, req.body, (err, result) => {
                    client.close();
                    res.json(result);
                })
            }
        })
    });
})

module.exports = router;
