var http = require('http');

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
    if(!err) {
        console.log("We are connected");
        var collection = db.collection('unicorns');
        collection.find().toArray(function(err, items) {
            console.log(items);
        });
    } else {

    }
});

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(8080);

console.log('Server running on port 8080.');